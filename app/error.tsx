'use client';

import Link from 'next/link';
import Footer from '@/components/Footer';
import SiteHeader from '@/components/SiteHeader';

// Route error boundary. Error pages keep the app shell (witus docs/shared-ui-ux-dx.md): the root
// layout renders no header or footer, so this boundary renders both itself. No error text reaches
// the visitor; the digest is an opaque id the server logs carry. Sentry gets the exception through
// instrumentation.ts (onRequestError), so nothing is reported twice here.
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="mx-auto w-full max-w-xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Something went wrong</h1>
          <p role="alert" className="mt-4 text-slate-700">
            This page hit an unexpected error. Try again, or go back to the course page.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-11 items-center rounded-lg bg-emerald-600 px-6 font-bold text-white hover:bg-emerald-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            >
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center rounded-md px-4 font-semibold text-emerald-800 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
            >
              Back to the course page
            </Link>
          </div>
          {error.digest ? (
            <p className="mt-6 text-xs text-slate-600">Reference: {error.digest}</p>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
}
