import * as Sentry from '@sentry/nextjs';
import { scrubEvent } from '@/lib/sentry-scrub';

/**
 * Edge-runtime error monitoring. This is the one that covers proxy.ts, which enforces the 21+
 * age gate on every request, so a crash here is a compliance problem and not just a 500.
 *
 * Same DSN guard as the server config: inert with no `SENTRY_DSN`. Loaded from `register()` in
 * instrumentation.ts on the edge runtime.
 */
const dsn = process.env.SENTRY_DSN;
if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.SENTRY_ENVIRONMENT ?? process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    tracesSampleRate: 0,
    sendDefaultPii: false,
    beforeSend: scrubEvent,
  });
}
