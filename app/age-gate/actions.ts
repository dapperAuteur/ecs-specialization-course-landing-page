'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { COOKIE_NAME, COOKIE_OPTIONS, buildAttestationCookieValue } from '@/lib/age-gate';

/**
 * Set the 21+ attestation cookie and redirect to the user's intended
 * destination. Called from app/age-gate/page.tsx Yes button.
 *
 * The cookie value is signed (HMAC-SHA256 over base64url(payload) keyed
 * on AGE_GATE_COOKIE_SECRET); the proxy verifies the signature on every
 * request, so a tampered or fabricated cookie won't pass.
 */
export async function attestAdult(formData: FormData) {
  const next = (formData.get('next') as string | null) ?? '/';
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/';

  const { value } = buildAttestationCookieValue();
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, value, COOKIE_OPTIONS);

  redirect(safeNext);
}
