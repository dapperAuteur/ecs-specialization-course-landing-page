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
├── proxy.ts                    # Next 16 age-gate enforcement
├── scripts/validate-env.ts     # Eager build-time env validation
└── drizzle.config.ts           # drizzle-kit config
```

## Error Monitoring

Crashes report to [Better Stack](https://betterstack.com), which speaks the Sentry ingest protocol, so the wiring is the standard `@sentry/nextjs` setup. Errors only: no tracing, no session replay, and `sendDefaultPii: false`.

**It is off until a DSN exists.** Every init is guarded on `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN`, so with those unset the SDK never initialises, nothing is sent, and the app builds and runs unchanged. See `.env.example` for the full var list.

Because a crash report is a copy of request context handed to a third party, everything passes through `beforeSend` in [lib/sentry-scrub.ts](lib/sentry-scrub.ts) first. It strips the lead email (which rides in `/thanks?email=...`, so it lands in both `request.url` and the separate `request.query_string`), the 21+ attestation cookie, the reCAPTCHA token, the inbox HMAC signature, and Neon credentials. It deliberately KEEPS what you triage with: the host, the route, status and Postgres error codes, the reCAPTCHA score, and the public ebook slug. Both directions are asserted in [tests/sentry-scrub.test.ts](tests/sentry-scrub.test.ts) (`npm test`), because a scrubber that redacts everything is as broken as one that redacts nothing.

## Deployment

Deployed on Vercel. Environment variables provisioned per [witus task #21](https://github.com/dapperAuteur/witus). `npm run build` runs `validate-env.ts` first; missing or short env vars fail the build.

## License

Proprietary B4C LLC / AwesomeWebStore.com
