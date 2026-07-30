import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
};

/**
 * Wrap with Sentry's build plugin so client stack traces are readable instead of minified.
 *
 * Safe with no Sentry env set: without `SENTRY_AUTH_TOKEN` it simply skips the source-map
 * upload, and the runtime SDK stays inert without a DSN. `org`, `project`, and the auth token
 * all come from env, so nothing vendor-specific or secret is committed here.
 */
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  // Quiet locally, verbose in CI where the log is the only way to see an upload failure.
  silent: !process.env.CI,
  widenClientFileUpload: true,
  // Works under both bundlers, unlike the `webpack` block below.
  bundleSizeOptimizations: {
    excludeDebugStatements: true,
  },
  webpack: {
    // Replaces the deprecated top-level `disableLogger`. No effect while this repo builds with
    // Turbopack (see `bundleSizeOptimizations` above), kept correct for a webpack fallback.
    treeshake: {
      removeDebugLogging: true,
    },
  },
});
