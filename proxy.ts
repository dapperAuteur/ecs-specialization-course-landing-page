import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME, verifyCookieValue } from '@/lib/age-gate';

/**
 * Next 16 proxy. Enforces the 21+ age-gate at the edge.
 *
 * Bypassed paths (so the gate doesn't loop on itself or break delivery):
 *   /age-gate*       : the attestation page itself
 *   /safety*         : mental-health resources, must be reachable for anyone
 *                      in crisis regardless of age attestation
 *   /api/*           : server endpoints (server-side verifies its own way)
 *   /thanks          : post-submit confirmation (already attested)
 *   /_next/*, static : assets
 *
 * Everything else, including /ebook/*, runs through the gate. The ebook is
 * publicly downloadable but ONLY for 21+-attested visitors; no token, no
 * form submission, no email. Compliance lives in the cookie check, not in
 * a per-user URL.
 */
export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (
    pathname.startsWith('/age-gate') ||
    pathname.startsWith('/safety') ||
    pathname.startsWith('/api') ||
    pathname === '/thanks' ||
    pathname.startsWith('/_next')
  ) {
    return NextResponse.next();
  }

  const cookieValue = req.cookies.get(COOKIE_NAME)?.value;
  const result = verifyCookieValue(cookieValue);
  if (result.ok) {
    return NextResponse.next();
  }

  const next = encodeURIComponent(pathname + search);
  const url = req.nextUrl.clone();
  url.pathname = '/age-gate';
  url.search = `?next=${next}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals + common static assets at the matcher level so the
  // proxy isn't invoked on every byte. Specific path bypasses above remain
  // for routes we own.
  matcher: ['/((?!_next/|favicon|.*\\.(?:ico|png|jpg|jpeg|svg|webp|woff2?|css|js|txt|xml|map)$).*)'],
};
