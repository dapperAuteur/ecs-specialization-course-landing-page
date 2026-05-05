import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { getEnv } from './env';

/**
 * 21+ age-gate. Signed HttpOnly cookie + server-side verification.
 *
 * Cookie value shape:
 *   "<base64url(payload)>.<hex(hmac)>"
 *   where payload = JSON.stringify({attested_at, session_id})
 *
 * The cookie is the user-facing UX gate (proxy.ts redirects to
 * /age-gate when missing). The server action also verifies the
 * cookie before accepting a form submission, so a client that
 * bypasses the proxy still cannot submit without attesting.
 *
 * Never store birthdate. Only an attestation timestamp + an opaque
 * session id (used to correlate the consent log row).
 *
 * Dev fallback: if AGE_GATE_COOKIE_SECRET is missing in
 * NODE_ENV=development, verify always returns ok:true so local dev
 * works without the operator-side env provisioning. Production
 * fails closed.
 */

export const COOKIE_NAME = 'ecs_age_attested';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

interface AttestationPayload {
  attested_at: string;
  session_id: string;
}

export interface AgeGateResult {
  ok: boolean;
  attestedAt?: string;
  sessionId?: string;
  reason?: 'no-cookie' | 'invalid-format' | 'invalid-signature' | 'expired' | 'misconfigured';
}

function readSecret(): string | null {
  try {
    return getEnv().AGE_GATE_COOKIE_SECRET;
  } catch {
    return null;
  }
}

function b64urlEncode(s: string): string {
  return Buffer.from(s, 'utf8')
    .toString('base64')
    .replace(/=+$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function b64urlDecode(s: string): string {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
  return Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/') + pad, 'base64').toString('utf8');
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex');
}

function safeEq(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

/**
 * Build a fresh attestation cookie value. Caller is responsible for
 * setting the cookie on the response (HttpOnly, Secure, SameSite=Lax,
 * Max-Age=30d).
 */
export function buildAttestationCookieValue(): { value: string; sessionId: string; attestedAt: string } {
  const secret = readSecret();
  if (!secret && process.env.NODE_ENV !== 'development') {
    throw new Error('AGE_GATE_COOKIE_SECRET is required to issue attestation cookies');
  }
  const payload: AttestationPayload = {
    attested_at: new Date().toISOString(),
    session_id: randomUUID(),
  };
  const encoded = b64urlEncode(JSON.stringify(payload));
  const signature = secret ? sign(encoded, secret) : 'dev';
  return {
    value: `${encoded}.${signature}`,
    sessionId: payload.session_id,
    attestedAt: payload.attested_at,
  };
}

/**
 * Cookie options used everywhere the cookie is set/cleared.
 */
export const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: MAX_AGE_SECONDS,
  path: '/',
};

/**
 * Verify an attestation cookie value (string). Returns the payload
 * data on success. Used by the server action; the proxy uses
 * verifyCookieValue() too via the cookie store directly.
 */
export function verifyCookieValue(value: string | undefined): AgeGateResult {
  if (!value) return { ok: false, reason: 'no-cookie' };

  const dot = value.lastIndexOf('.');
  if (dot < 1) return { ok: false, reason: 'invalid-format' };
  const encoded = value.slice(0, dot);
  const sig = value.slice(dot + 1);

  const secret = readSecret();
  if (!secret) {
    if (process.env.NODE_ENV === 'development') {
      // Accept any well-formed cookie in development
      try {
        const payload = JSON.parse(b64urlDecode(encoded)) as AttestationPayload;
        return { ok: true, attestedAt: payload.attested_at, sessionId: payload.session_id };
      } catch {
        return { ok: false, reason: 'invalid-format' };
      }
    }
    return { ok: false, reason: 'misconfigured' };
  }

  const expected = sign(encoded, secret);
  if (!safeEq(sig, expected)) return { ok: false, reason: 'invalid-signature' };

  let payload: AttestationPayload;
  try {
    payload = JSON.parse(b64urlDecode(encoded)) as AttestationPayload;
  } catch {
    return { ok: false, reason: 'invalid-format' };
  }

  // Reject cookies older than the cookie max-age (defense in depth — the
  // browser should already drop them).
  const attestedMs = Date.parse(payload.attested_at);
  if (!Number.isFinite(attestedMs) || Date.now() - attestedMs > MAX_AGE_SECONDS * 1000) {
    return { ok: false, reason: 'expired' };
  }

  return { ok: true, attestedAt: payload.attested_at, sessionId: payload.session_id };
}

/**
 * Server-side entry point used by the form server action. Reads from
 * next/headers cookies() and runs verifyCookieValue.
 */
export async function verifyAgeGate(): Promise<AgeGateResult> {
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  return verifyCookieValue(value);
}
