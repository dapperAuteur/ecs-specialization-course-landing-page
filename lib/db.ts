import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import { getEnv } from './env';
import * as schema from '@/db/schema';

let cached: ReturnType<typeof drizzle<typeof schema>> | null = null;

/**
 * Drizzle client over the Neon serverless pool. Pooled connection
 * (`STORAGE_DATABASE_URL`); migrations use the unpooled URL via
 * `drizzle.config.ts`.
 */
export function getDb() {
  if (cached) return cached;
  const env = getEnv();
  const pool = new Pool({ connectionString: env.STORAGE_DATABASE_URL });
  cached = drizzle(pool, { schema });
  return cached;
}
