import * as Sentry from '@sentry/nextjs';
import { scrubEvent } from '@/lib/sentry-scrub';

/**
 * Server-runtime error monitoring. Loaded from `register()` in instrumentation.ts on the Node
 * runtime. The backend is Better Stack, which speaks the Sentry ingest protocol, so the DSN is
 * the only thing that points this at one vendor rather than another.
 *
 * GUARDED ON THE DSN. With no `SENTRY_DSN` set, `init` is skipped entirely and the SDK is inert:
 * the app builds, deploys, and runs exactly as it does today until BAM provisions the Better
 * Stack source and sets the var (see plans/user-tasks/01-betterstack-sentry-dsn.md).
 *
 * Read straight from `process.env` rather than through `lib/env.ts` on purpose. This module runs
 * at process boot, ahead of and independent of the validated reader, and the error-reporting path
 * must never be the thing that throws. `lib/env.ts` still declares both DSN vars (optional) so
 * they are documented and shape-checked at build.
 */
const dsn = process.env.SENTRY_DSN;
if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.SENTRY_ENVIRONMENT ?? process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    // Errors only. No tracing spend, and nothing that would sample a lead's session.
    tracesSampleRate: 0,
    // Never auto-attach IP, cookies, or request bodies. `beforeSend` is the second line of
    // defense for anything that gets attached by hand or by an integration.
    sendDefaultPii: false,
    beforeSend: scrubEvent,
  });
}
