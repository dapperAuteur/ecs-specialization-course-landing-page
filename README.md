# ECS Specialization

Endocannabinoid System specialization course. Lead capture for the May 2026 cohort.

## About

Deployed at [ecs-specialization.betterbud.club](https://ecs-specialization.betterbud.club). The site has one job: capture leads for a class about the **endogenous** cannabinoid system, the mammalian signaling network of receptors, ligands, and enzymes that regulates homeostasis. The curriculum is human-biology science education. It is **not** about the cannabis plant and it is not a drug-use course.

Operated by B4C LLC / AwesomeWebStore.com. Built by [Brand Anthony McDonald](https://brandanthonymcdonald.com).

## Ecosystem Positioning

Sits alongside [CentenarianOS](https://centenarianos.com) (the longevity OS that will eventually host the enrolled course) and [brandanthonymcdonald.com](https://brandanthonymcdonald.com) (BAM's practitioner-scholar portfolio). Because the class touches a regulated adult-education topic, **every lead form on this site is behind a 21+ age-verification gate** enforced by [proxy.ts](proxy.ts) and a signed HttpOnly cookie. Leads flow to the ecosystem inbox via a HMAC-signed webhook to `inbox.witus.online`. **Keap integration is deferred**; see [plans/future/keap-integration.md](plans/future/keap-integration.md) once that file ships in Phase 12 of the rebuild.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript strict |
| Styling | Tailwind CSS v4 |
| Database | Neon Postgres + Drizzle ORM |
| Bot check | Google reCAPTCHA v3 |
| Compliance | 21+ signed-cookie age-gate via `proxy.ts` |
| Webhook | HMAC-SHA256 to `inbox.witus.online/api/ingest` |
| Ebook delivery | Signed JWT (24h) via `/ebook/[slug]` route |
| Health check | Uncached `/api/health`, probes Neon with `select 1` |
| Analytics | Vercel Analytics |
| Error monitoring | Better Stack via the Sentry SDK, inert unless a DSN is set |
| Tests | Vitest (`npm test`) |
| Hosting | Vercel |

## Quick Start

```bash
npm install
cp .env.example .env.local        # fill in values per task #21
npm run db:push                    # creates lead table on Neon
npm run dev
```

Other scripts: `npm run typecheck` (tsc), `npm run lint` (eslint), `npm test` (vitest).

Open [http://localhost:3000](http://localhost:3000). The age-gate redirects you to `/age-gate` first. Attest 21+ and you'll be sent to the landing page.

## Project Structure

```
ecs-specialization-course-landing-page/
├── app/
│   ├── layout.tsx              # Root layout, metadata, OG, Vercel Analytics
│   ├── global-error.tsx        # Root error boundary, reports to Better Stack
│   ├── page.tsx                # Landing page (Server Component) + Course JSON-LD
│   ├── opengraph-image.tsx     # Dynamic 1200×630 OG image (placeholder)
│   ├── sitemap.ts, robots.ts   # SEO
│   ├── globals.css
│   ├── actions.ts              # submitLead server action
│   ├── thanks/page.tsx         # Post-submit confirmation + ebook download CTA
│   ├── age-gate/
│   │   ├── page.tsx            # 21+ attestation
│   │   ├── actions.ts          # attestAdult: sets signed cookie
│   │   └── under-21/page.tsx   # Terminal dead-end
│   ├── api/health/route.ts     # Uptime health check (GET + HEAD, never cached)
│   ├── ebook/[slug]/route.ts   # Signed-JWT PDF delivery
│   └── ebooks/                 # Non-public PDF storage (drop <slug>.pdf here)
├── components/                 # Hero, Stats, ProblemStatement, CourseFeatures,
│                               # CourseCurriculum, SpecializationTracks,
│                               # ScientificEvidence, LeadForm, RecaptchaProvider,
│                               # Footer
├── db/schema.ts                # Drizzle schema (lead table)
├── lib/
│   ├── env.ts                  # Zod-validated env reader
│   ├── db.ts, db-safe.ts       # Drizzle client + PII-safe write wrapper
│   ├── recaptcha.ts            # reCAPTCHA v3 server-side verify
│   ├── age-gate.ts             # Signed cookie mint + verify
│   ├── ebook.ts                # JWT mint + verify
│   ├── inbox.ts                # HMAC-signed outbound webhook
│   └── sentry-scrub.ts         # beforeSend PII/credential scrubber
├── instrumentation.ts          # Sentry per-runtime load + onRequestError
├── instrumentation-client.ts   # Browser-runtime Sentry init
├── sentry.server.config.ts     # Node-runtime Sentry init (DSN-guarded)
├── sentry.edge.config.ts       # Edge-runtime Sentry init (DSN-guarded)
├── tests/sentry-scrub.test.ts  # Vitest suite for the scrubber
├── tests/health-route.test.ts  # Vitest suite for /api/health (leak assertions)
├── proxy.ts                    # Next 16 age-gate enforcement
├── scripts/validate-env.ts     # Eager build-time env validation
└── drizzle.config.ts           # drizzle-kit config
```

## Error Monitoring

Crashes report to [Better Stack](https://betterstack.com), which speaks the Sentry ingest protocol, so the wiring is the standard `@sentry/nextjs` setup. Errors only: no tracing, no session replay, and `sendDefaultPii: false`.

**It is off until a DSN exists.** Every init is guarded on `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN`, so with those unset the SDK never initialises, nothing is sent, and the app builds and runs unchanged. See `.env.example` for the full var list.

Because a crash report is a copy of request context handed to a third party, everything passes through `beforeSend` in [lib/sentry-scrub.ts](lib/sentry-scrub.ts) first. It strips the lead email (which rides in `/thanks?email=...`, so it lands in both `request.url` and the separate `request.query_string`), the 21+ attestation cookie, the reCAPTCHA token, the inbox HMAC signature, and Neon credentials. It deliberately KEEPS what you triage with: the host, the route, status and Postgres error codes, the reCAPTCHA score, and the public ebook slug. Both directions are asserted in [tests/sentry-scrub.test.ts](tests/sentry-scrub.test.ts) (`npm test`), because a scrubber that redacts everything is as broken as one that redacts nothing.

## Health Check

**Point uptime monitors at [`/api/health`](app/api/health/route.ts), not at `/`.**

The homepage is statically prerendered (confirm with the `○` next to `/` in `npm run build` output), so a monitor watching it can be served a 200 straight from the Vercel edge cache while Neon is unreachable and every lead submission is failing. A green check there is close to meaningless.

`/api/health` is `force-dynamic` with `revalidate = 0` and `Cache-Control: no-store`, and it runs `select 1` through the same Drizzle client the lead form and the download log use. It answers both `GET` and `HEAD`.

| Status | Body |
|---|---|
| `200` | `{"ok":true,"checks":{"database":"ok"}}` |
| `503` | `{"ok":false,"error":"dependency_unavailable"}` |

**What a 200 proves:** a server route handler executed on this deploy (so the build is live and the function boots), and Neon answered a query within 4 seconds using the app's real connection settings.

**What a 200 does NOT prove:** that a lead can actually be captured end to end. The route deliberately does not touch reCAPTCHA, the HMAC webhook to `inbox.witus.online`, Better Stack, or any other third party, because a vendor outage that the site survives must not redden the monitor and train people to ignore the page. It also does not exercise writes, the age-gate cookie path, or the ebook PDFs. It is a dependency check, not a synthetic funnel test.

**What it never leaks.** The route is public and unauthenticated, so it emits no version, no environment values, no row counts, and nothing from the lead table. The failure path matters most: a Neon connection error carries the database password in its message, so the `catch` takes **no binding at all**, the 503 body is a fixed literal token, and the log line is a constant string rather than an interpolated error. Those guarantees are asserted in [tests/health-route.test.ts](tests/health-route.test.ts) (`npm test`), which checks that the credential is absent from the body and the log as explicitly as it checks that the status code is right.

Suggested monitor settings: 60s interval, expect HTTP 200, optionally keyword-match `"ok":true`. Alert on two consecutive failures so a single cold start or Neon autosuspend wake does not page anyone.

## Deployment

Deployed on Vercel. Environment variables provisioned per [witus task #21](https://github.com/dapperAuteur/witus). `npm run build` runs `validate-env.ts` first; missing or short env vars fail the build.

## License

Proprietary B4C LLC / AwesomeWebStore.com
