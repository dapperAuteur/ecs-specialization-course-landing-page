import type { Config } from 'drizzle-kit';

/**
 * Drizzle-kit config. Migrations use the UNPOOLED Neon URL because pgbouncer
 * doesn't support the prepared statements drizzle-kit uses. Runtime queries
 * go through the pooled URL via `lib/db.ts`.
 */
export default {
  schema: './db/schema.ts',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.STORAGE_DATABASE_URL_UNPOOLED ?? '',
  },
} satisfies Config;
