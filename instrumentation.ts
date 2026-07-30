import * as Sentry from '@sentry/nextjs';
import type { Instrumentation } from 'next';

/**
 * Next.js instrumentation hook. Loads the right Sentry config per runtime and reports
 * server-side App Router errors through `onRequestError`.
 *
 * Everything here is inert without a `SENTRY_DSN`: the configs guard on it, and both
 * `captureRequestError` and `withScope` are no-ops on an uninitialised client.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') await import('./sentry.server.config');
  if (process.env.NEXT_RUNTIME === 'edge') await import('./sentry.edge.config');
}

/**
 * Captures errors thrown while rendering or serving a request.
 *
 * We tag the ROUTE TEMPLATE (`/ebook/[slug]`) rather than the resolved path, and the route type,
 * so a crash is attributable without carrying a lead's email from `/thanks?email=...` into the
 * tag. `routeType: 'proxy'` is the age-gate in proxy.ts, which is the failure worth paging on:
 * if the gate throws, a 21+ compliance check is not running.
 *
 * `captureRequestError` still builds the request context itself; `beforeSend` in
 * lib/sentry-scrub.ts is what strips the cookies, the query string, and the PII from it.
 */
export const onRequestError: Instrumentation.onRequestError = (err, request, context) => {
  Sentry.withScope((scope) => {
    scope.setTag('route', context.routePath);
    scope.setTag('route.type', context.routeType);
    Sentry.captureRequestError(err, request, context);
  });
};
