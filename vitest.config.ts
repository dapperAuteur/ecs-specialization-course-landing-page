import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

/**
 * Vitest config. The only suite today is the Sentry scrubber, which is pure and dependency-free
 * on purpose so it can be tested without booting Next or the Sentry SDK.
 *
 * The `@/` alias mirrors tsconfig.json's `paths` so a test imports modules exactly the way the
 * app does.
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
