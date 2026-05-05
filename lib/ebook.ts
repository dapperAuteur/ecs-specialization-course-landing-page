import jwt from 'jsonwebtoken';
import { getEnv } from './env';

/**
 * Ebook delivery — signed-JWT URL minting + verification.
 *
 * Mint: 24h HMAC-SHA256 JWT carrying {slug, lead_id}. Verify on the
 * route at app/ebook/[slug]/route.ts; on success, stream the PDF from
 * app/ebooks/<slug>.pdf with Cache-Control: private, no-store and
 * X-Robots-Tag: noindex, nofollow. PDF location is non-public so the
 * route is the only access path.
 *
 * Dev fallback: if EBOOK_JWT_SECRET is missing in development, mint
 * an unsigned synthetic token that the verify path accepts (also
 * dev-only). Production fails closed.
 */

interface MintArgs {
  slug: string;
  leadId: string;
  ttlHours?: number;
}

export interface MintedUrl {
  url: string;
  expiresAt: string;
}

interface DownloadClaims {
  slug: string;
  lead_id: string;
  exp: number;
  iat: number;
}

const DEV_TOKEN_PREFIX = 'dev-';

function readSecret(): string | null {
  try {
    return getEnv().EBOOK_JWT_SECRET;
  } catch {
    return null;
  }
}

function readBaseUrl(): string {
  try {
    return getEnv().EBOOK_BASE_URL;
  } catch {
    return '';
  }
}

export function mintDownloadUrl({ slug, leadId, ttlHours = 24 }: MintArgs): MintedUrl {
  const expiresAtMs = Date.now() + ttlHours * 3600 * 1000;
  const expiresAt = new Date(expiresAtMs).toISOString();

  const secret = readSecret();
  let token: string;
  if (!secret) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[ebook] dev token (EBOOK_JWT_SECRET missing)');
      token = `${DEV_TOKEN_PREFIX}${slug}-${leadId}-${expiresAtMs}`;
    } else {
      throw new Error('EBOOK_JWT_SECRET is required to mint download URLs');
    }
  } else {
    token = jwt.sign(
      { slug, lead_id: leadId } satisfies Pick<DownloadClaims, 'slug' | 'lead_id'>,
      secret,
      { algorithm: 'HS256', expiresIn: `${ttlHours}h` },
    );
  }

  const base = readBaseUrl();
  const path = `/ebook/${encodeURIComponent(slug)}?t=${encodeURIComponent(token)}`;
  return { url: base ? `${base}${path}` : path, expiresAt };
}

export interface VerifyResult {
  ok: boolean;
  slug?: string;
  leadId?: string;
  reason?: 'missing-token' | 'invalid' | 'expired' | 'slug-mismatch' | 'misconfigured';
}

export function verifyDownloadToken(token: string | null, expectedSlug: string): VerifyResult {
  if (!token) return { ok: false, reason: 'missing-token' };

  // Dev-token short-circuit (only honored when secret is missing in development)
  if (token.startsWith(DEV_TOKEN_PREFIX) && process.env.NODE_ENV === 'development') {
    const parts = token.slice(DEV_TOKEN_PREFIX.length).split('-');
    if (parts.length < 3) return { ok: false, reason: 'invalid' };
    const expMs = Number.parseInt(parts[parts.length - 1] ?? '', 10);
    if (!Number.isFinite(expMs) || expMs < Date.now()) return { ok: false, reason: 'expired' };
    const tokenSlug = parts[0];
    if (tokenSlug !== expectedSlug) return { ok: false, reason: 'slug-mismatch' };
    return { ok: true, slug: tokenSlug, leadId: parts.slice(1, -1).join('-') };
  }

  const secret = readSecret();
  if (!secret) return { ok: false, reason: 'misconfigured' };

  try {
    const claims = jwt.verify(token, secret, { algorithms: ['HS256'] }) as DownloadClaims;
    if (claims.slug !== expectedSlug) return { ok: false, reason: 'slug-mismatch' };
    return { ok: true, slug: claims.slug, leadId: claims.lead_id };
  } catch (err) {
    if ((err as { name?: string }).name === 'TokenExpiredError') {
      return { ok: false, reason: 'expired' };
    }
    return { ok: false, reason: 'invalid' };
  }
}
