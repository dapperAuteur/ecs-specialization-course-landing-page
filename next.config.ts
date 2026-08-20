import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  // PostHog's endpoints use trailing slashes (/e/, /flags/, /s/). Without this, Next
  // issues a 308 to the slashless form before the rewrite runs and ingest breaks.
  // Required by PostHog's documented Next.js proxy setup.
  //
  // SIDE EFFECT worth knowing: this disables Next's automatic trailing-slash redirect
  // for EVERY route, not just /ingest. So /privacy/ no longer 308s to /privacy and both
  // forms become reachable. The per-page `alternates.canonical` metadata (layout.tsx,
  // privacy, terms, safety) is what keeps search engines pointed at one form — verify
  // those survive any future metadata refactor.
  skipTrailingSlashRedirect: true,

  async rewrites() {
    // Reverse-proxy PostHog through our own origin. us.i.posthog.com is on uBlock
    // Origin, Brave Shields, and Safari's tracker list, so a meaningful share of
    // events never leave the browser — including, reliably, our own test visits.
    // Routing ingest through this domain leaves blockers nothing to match on.
    //
    // Assets come from a different upstream host than ingest, hence two rules. The
    // more specific /static rule must come first.
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
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
