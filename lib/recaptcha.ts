import { getEnv } from './env';

interface SiteVerifyResponse {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

export interface RecaptchaResult {
  ok: boolean;
  score: number | null;
  reason?: 'low-score' | 'verify-failed' | 'misconfigured';
}

/**
 * Verify a reCAPTCHA v3 token with Google's siteverify endpoint.
 * Score threshold 0.5 (the prior route.ts default; tune post-launch
 * based on rejection rate per the plan's risk log).
 *
 * Dev fallback: when RECAPTCHA_SECRET_KEY is unset and NODE_ENV is
 * 'development', skip the network call and return a synthetic pass.
 */
export async function verifyRecaptcha(token: string): Promise<RecaptchaResult> {
  if (!token) {
    return { ok: false, score: null, reason: 'verify-failed' };
  }

  let secret: string;
  try {
    secret = getEnv().RECAPTCHA_SECRET_KEY;
  } catch {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[recaptcha] dev fallback — RECAPTCHA_SECRET_KEY missing, skipping verify');
      return { ok: true, score: 0.9 };
    }
    return { ok: false, score: null, reason: 'misconfigured' };
  }

  const params = new URLSearchParams({ secret, response: token });
  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });

  if (!res.ok) {
    return { ok: false, score: null, reason: 'verify-failed' };
  }

  const data = (await res.json()) as SiteVerifyResponse;
  if (!data.success) {
    return { ok: false, score: data.score ?? null, reason: 'verify-failed' };
  }
  const score = data.score ?? 0;
  if (score < 0.5) {
    return { ok: false, score, reason: 'low-score' };
  }
  return { ok: true, score };
}
