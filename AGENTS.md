<!-- BEGIN:nextjs-agent-rules -->
# Next.js version note
This repo currently runs **Next 15.4.5**, so `middleware.ts` is still the active proxy mechanism. The ecosystem adoption-kit specifies `proxy.ts` (the Next 16 replacement) as the target — the rename ships with the Next 16 upgrade plan, not before. Until then, follow Next 15 App Router conventions and check `node_modules/next/dist/docs/` when in doubt.
<!-- END:nextjs-agent-rules -->

---

# ECS Specialization Course Landing Page — agent instructions

**One job:** May 2026 ECS specialization class lead capture at [ecs-specialization.betterbud.club](https://ecs-specialization.betterbud.club). Adult-audience (21+) compliance-gated lead form. That's it — course delivery, payments, drip campaigns, and CRM all live in other repos.

**Read order before writing any code:**

1. [`./plans/ecosystem/README.md`](./plans/ecosystem/README.md) — ecosystem platform index + Redundancy Test
2. [`./plans/ecosystem/ecs-specialization-course-landing-page.md`](./plans/ecosystem/ecs-specialization-course-landing-page.md) — this product's one-job definition
3. [`./plans/00-descriptions.md`](./plans/00-descriptions.md) — non-negotiables, coding style, git workflow, verification
4. [`./plans/user-tasks/00-descriptions.md`](./plans/user-tasks/00-descriptions.md) — operator task queue; pointer to canonical witus queue for ecosystem tasks
5. Workflow descriptors: bugs · future · validate · reports (in `./plans/`)
6. The specific `./plans/NN-*.md` plan you are executing

**Hard rules (grep in [`./plans/00-descriptions.md`](./plans/00-descriptions.md)):**
- Mobile-first 360px, ARIA-compliant, keyboard-reachable, focus rings visible
- TypeScript strict. Server Components by default
- **21+ age-gate on every lead form is a HARD compliance requirement.** Enforced server-side, not just client UX. No paid traffic may point at an ungated variant.
- PII-safe DB writes via `lib/db-safe.ts` — never call Mongoose `Lead` writes directly from route handlers
- Secrets via `lib/env.ts` (Zod). Eager validation at build via `scripts/validate-env.ts`. Never commit `.env*` except `.env.example`
- HMAC-signed webhooks for inter-repo communication (5-min skew, constant-time compare)
- Next 15 today → use `middleware.ts`; Next 16 upgrade switches to `proxy.ts` (tracked in roadmap v1b)
- `plans/` is gitignored. **Never push to `main`** — user reviews + pushes
- **Cross-repo edits:** branch in the sibling, user-task in origin queue for merge/push

**If you are changing something the ecosystem docs call out as another platform's job: stop and ask.** Most of what a "class lead form" app might want to do (drip, enrollment, billing, student dashboard) lives elsewhere.
