<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version (Next 16) has breaking changes — APIs, conventions, and file structure may differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices. **Use `proxy.ts` (not `middleware.ts`).**
<!-- END:nextjs-agent-rules -->

---

# ECS Specialization — agent instructions

**One job:** lead capture for the May 2026 ECS specialization class at [ecs-specialization.betterbud.club](https://ecs-specialization.betterbud.club). Adult-audience (21+) compliance-gated form. Course delivery, payments, drip campaigns, and CRM all live in other repos.

**Read order before writing any code:**

1. [`./plans/ecosystem/README.md`](./plans/ecosystem/README.md) — ecosystem platform index + Redundancy Test
2. [`./plans/ecosystem/ecs-specialization-course-landing-page.md`](./plans/ecosystem/ecs-specialization-course-landing-page.md) — this product's one-job definition + roadmap
3. [`./plans/00-descriptions.md`](./plans/00-descriptions.md) — non-negotiables, coding style, git workflow, verification
4. [`./plans/user-tasks/00-descriptions.md`](./plans/user-tasks/00-descriptions.md) — operator task queue (pointer to canonical witus queue for ecosystem tasks)
5. Workflow descriptors: bugs · future · validate · reports (in `./plans/`)
6. The specific `./plans/NN-*.md` plan you are executing

**Hard rules (grep in [`./plans/00-descriptions.md`](./plans/00-descriptions.md)):**
- Mobile-first 360px, ARIA-compliant, keyboard-reachable, focus rings visible
- TypeScript strict. Server Components by default
- **21+ age-gate on every lead form is a HARD compliance requirement.** Enforced server-side via `proxy.ts` + signed cookie (`lib/age-gate.ts`) + a `verifyCookie()` check in the form server action. No paid traffic may point at an ungated variant
- PII-safe DB writes via `lib/db-safe.ts` — never call Drizzle insert directly from a server action
- Secrets via `lib/env.ts` (Zod, lazy). Eager validation at build via `scripts/validate-env.ts`. Never commit `.env*` except `.env.example`
- HMAC-signed outbound webhook to `inbox.witus.online/api/ingest` (5-min skew, constant-time compare)
- Next 16 → use `proxy.ts`, not `middleware.ts`
- `plans/` is gitignored; `_archive/` is gitignored. **Never push to `main`** — user reviews + pushes
- **Branches stay small.** One focused change per branch. Split UI from backend, refactor from new feature, page A from page B. When in doubt, queue multiple branches. Multi-feature branches make review heavy and rollback expensive.
- **Cross-repo edits:** branch in the sibling, user-task in origin queue (witus `plans/user-tasks/`) for merge/push

**Stack reality (post-`feat/01-rebuild`):**
- Next 16 (Turbopack) + React 19 + TypeScript strict
- Tailwind v4
- Neon Postgres + Drizzle (`db/schema.ts`, `lib/db.ts`)
- Google reCAPTCHA v3 (`lib/recaptcha.ts`) — NOT Turnstile
- HMAC webhook to witus-inbox (`lib/inbox.ts`)
- Signed-JWT ebook delivery (`lib/ebook.ts` + `app/ebook/[slug]/route.ts`)
- Signed-cookie 21+ age-gate (`lib/age-gate.ts` + `proxy.ts` + `app/age-gate/`)
- **Keap deferred to backlog** — see `plans/future/keap-integration.md`. Do not add `lib/keap.ts` without revisiting the deferral decision.
- No NextAuth, no Mongoose, no admin surface in this repo

**If you are changing something the ecosystem docs call out as another platform's job: stop and ask.** Most of what a "class lead form" app might want to do (drip, enrollment, billing, student dashboard) lives elsewhere.
