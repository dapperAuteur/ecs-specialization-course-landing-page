import { z } from 'zod';

/**
 * Lazy, Zod-validated env reader. Call `getEnv()` at use sites; do not destructure
 * `process.env` directly anywhere else in the app.
 *
 * Per `plans/00-descriptions.md` §3 Security: secrets only via `lib/env.ts`. Build-time
 * validation lives in `scripts/validate-env.ts` (prepended to `npm run build`).
 */

const envSchema = z.object({
  // Neon (per plans/21-fdac-ecs-rebuild-secret-provisioning.md §C)
  STORAGE_DATABASE_URL: z.string().url(),
  STORAGE_DATABASE_URL_UNPOOLED: z.string().url(),

  // Google reCAPTCHA v3 (Q5 lock 2026-05-04)
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string().min(1),
  RECAPTCHA_SECRET_KEY: z.string().min(1),

  // Inbox webhook (per task #21 §B/D/E)
  INBOX_INGEST_URL: z.string().url(),
  INBOX_INGEST_SECRET: z.string().min(32),
  INBOX_SOURCE_SLUG: z.literal('betterbud-ecs'),

  // Age-gate (Phase 9; per task #21 §E)
  AGE_GATE_COOKIE_SECRET: z.string().min(32),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

export function getEnv(): Env {
  if (cached) return cached;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
    throw new Error(`Invalid environment variables: ${issues}`);
  }
  cached = parsed.data;
  return cached;
}

/**
 * Public-key reader for client components — only the `NEXT_PUBLIC_*` vars.
 * Safe to import from a "use client" file.
 */
export function getPublicEnv() {
  return {
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '',
  };
}
