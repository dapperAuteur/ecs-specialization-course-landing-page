import * as Sentry from '@sentry/nextjs';
import { scrubEvent } from '@/lib/sentry-scrub';

/**
 * Client-runtime error monitoring. Reads the PUBLIC DSN, which Next inlines at build time.
 *
 * GUARDED ON THE DSN. With no `NEXT_PUBLIC_SENTRY_DSN` the SDK never initialises, so nothing is
 * sent, no network request is made, and nothing changes for a visitor. That guard is also why
 * lib/sentry-scrub.ts must stay free of regex lookbehind: this module ships in a browser chunk,
 * and a SyntaxError on older iOS Safari would break that chunk whether a DSN is set or not.
 */
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
    // Errors only. No tracing, and no session replay: this site collects adult-audience leads,
    // so recording a session would mean recording someone typing their email into a form.
    tracesSampleRate: 0,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    sendDefaultPii: false,
    beforeSend: scrubEvent,
  });
}

/** Instruments App Router client navigations. No-op when the SDK was never initialised. */
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
