import type { Config } from 'drizzle-kit';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Drizzle-kit config. Migrations use the UNPOOLED Neon URL because pgbouncer
 * doesn't support the prepared statements drizzle-kit uses. Runtime queries
 * go through the pooled URL via `lib/db.ts`.
 *
 * `.env.local` is loaded explicitly here because drizzle-kit invokes this
 * config from a plain Node process — it does not run inside `next` and does
 * not get Next.js's automatic env loading. CI / Vercel populate env vars
 * directly, so the file is only loaded when present locally.
 */
const envFile = resolve(process.cwd(), '.env.local');
if (existsSync(envFile)) {
  process.loadEnvFile(envFile);
}

export default {
  schema: './db/schema.ts',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.STORAGE_DATABASE_URL_UNPOOLED ?? '',
  },
} satisfies Config;
