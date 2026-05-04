/**
 * Eager build-time env validation. Prepended to `npm run build` via
 * package.json scripts so that missing env vars fail the build rather than
 * the runtime. Imports every env-reading module to force its lazy validator
 * to run.
 *
 * Loads .env.local explicitly because Next.js's env loading only runs inside
 * `next build` itself; this script runs before that.
 */

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const envFile = resolve(process.cwd(), '.env.local');
if (existsSync(envFile)) {
  process.loadEnvFile(envFile);
} else if (!process.env.STORAGE_DATABASE_URL) {
  // CI / Vercel populates env vars directly; only complain when both .env.local
  // is missing AND no env vars are present.
  console.warn('[validate-env] no .env.local found and no env vars in process — relying on injected env');
}

import('../lib/env')
  .then(({ getEnv }) => {
    getEnv();
    console.log('[validate-env] ✓ all required env vars present');
  })
  .catch((err: unknown) => {
    console.error('[validate-env] ✗', (err as Error).message);
    process.exit(1);
  });
