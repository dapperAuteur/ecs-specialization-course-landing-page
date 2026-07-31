'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

/**
 * Root error boundary. Catches errors thrown in the root layout itself, which is the one place
 * a normal `error.tsx` cannot reach.
 *
 * Because it replaces the root layout, it renders its own `<html>` and `<body>` and cannot rely
 * on `globals.css` being loaded, so the styling is inline. Mobile first at 360px, one `<h1>`,
 * and 44px minimum tap targets.
 *
 * `Sentry.captureException` is a no-op when no DSN is configured, so this page behaves the same
 * with or without Better Stack wired up.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          background: '#0f172a',
          color: '#0f172a',
        }}
      >
        <main
          style={{
            width: '100%',
            maxWidth: '448px',
            background: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            boxSizing: 'border-box',
          }}
        >
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 12px' }}>
            Something went wrong
          </h1>
          <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.5, margin: '0 0 20px' }}>
            We could not load this page. Nothing you submitted was lost. Please try again in a
            moment.
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'center',
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                minHeight: '44px',
                padding: '0 20px',
                borderRadius: '8px',
                border: 'none',
                background: '#047857',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
            {/* This boundary renders its own document outside the router, so a plain anchor is
                the correct control here rather than next/link. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                minHeight: '44px',
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0 20px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                color: '#0f172a',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Back to home
            </a>
          </div>
          {error.digest ? (
            <p style={{ color: '#94a3b8', fontSize: '12px', margin: '16px 0 0' }}>
              Reference: {error.digest}
            </p>
          ) : null}
        </main>
      </body>
    </html>
  );
}
