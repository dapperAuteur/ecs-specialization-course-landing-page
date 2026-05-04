import { cookies } from 'next/headers';

/**
 * 21+ age-gate cookie verification.
 *
 * STUB (Phase 5): always returns ok:true so the form server action runs
 * end-to-end during development. Phase 9 replaces this with HMAC-signed
 * cookie verification (lib/age-gate-cookie.ts) and the proxy.ts
 * enforcement at the edge.
 */

export interface AgeGateResult {
  ok: boolean;
  attestedAt?: string;
  sessionId?: string;
  reason?: 'no-cookie' | 'invalid-signature' | 'expired';
}

export async function verifyAgeGate(): Promise<AgeGateResult> {
  // PHASE 9 TODO: read cookie 'ecs_age_attested', verify HMAC over the
  // payload using AGE_GATE_COOKIE_SECRET, check expiry, return real result.
  // Until then we surface a synthetic attestation so the rest of the
  // pipeline can be exercised in dev.
  const cookieStore = await cookies();
  const existing = cookieStore.get('ecs_age_attested');
  if (existing) {
    return { ok: true, attestedAt: new Date().toISOString(), sessionId: existing.value };
  }
  if (process.env.NODE_ENV === 'development') {
    return { ok: true, attestedAt: new Date().toISOString(), sessionId: 'dev-stub' };
  }
  return { ok: false, reason: 'no-cookie' };
}
