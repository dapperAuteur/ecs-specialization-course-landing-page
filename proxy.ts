import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME, verifyCookieValue } from '@/lib/age-gate';

/**
 * Next 16 proxy. Enforces the 21+ age-gate at the edge.
 *
 * Bypassed paths (so the gate doesn't loop on itself or break delivery):
 *   /age-gate*           — the attestation page itself
 *   /terms, /privacy     — legal pages must be readable before attesting
 *   /api/*               — server endpoints (server-side verifies its own way)
 *   /ebook/*             — JWT-authenticated downloads (post-attestation)
 *   /thanks              — post-submit confirmation (already attested)
 *   /_next/*, static     — assets
 *
 * Everything else: read the ecs_age_attested cookie. If missing or
 * invalid, redirect to /age-gate with ?next=<original-path>.
 */
export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (
    pathname.startsWith('/age-gate') ||
    pathname === '/terms' ||
    pathname === '/privacy' ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/ebook') ||
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
