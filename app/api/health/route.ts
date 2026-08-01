import { sql } from 'drizzle-orm';
import { getDb } from '@/lib/db';

/**
 * Public, unauthenticated health check for uptime monitoring.
 *
 * Why it exists: a monitor pointed at `/` can get a 200 from the CDN edge cache
 * while Neon is unreachable, so a green check there proves nothing about the
 * lead funnel. This route is never cached and really talks to the database, so
 * a green check means a server handler ran on this deploy AND Postgres answered.
 *
 * What it checks:
 *   - Neon Postgres, via the cheapest possible probe (`select 1`) through the
 *     same Drizzle client the lead form and download log use.
 *
 * What it deliberately does NOT check (a vendor outage must not redden the
 * monitor, and paging on someone else's incident trains people to ignore pages):
 *   - reCAPTCHA, the witus-inbox webhook, Better Stack, Vercel Analytics.
 *
 * Responses:
 *   200 {"ok":true,"checks":{"database":"ok"}}
 *   503 {"ok":false,"error":"dependency_unavailable"}
 *
 * Leak rules, all load-bearing:
 *   - The catch has NO binding. A Neon failure carries the connection string,
 *     password included, in its message; it must not reach the body or the log.
 *   - The 503 body is a fixed literal token. No message, no code, no stack.
 *   - The log line is a constant string. Never an interpolated error.
 *   - Nothing about env, version, region, row counts, or lead data is emitted.
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const PROBE_TIMEOUT_MS = 4000;

const NO_STORE_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
} as const;

/**
 * Resolves true when Postgres answers within the budget, false on any error or
 * timeout. A hung socket must not hold the monitor's request open until the
 * platform kills the function, because that reads as a timeout rather than a
 * clean 503.
 */
async function databaseIsReachable(): Promise<boolean> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => reject(new Error('probe timeout')), PROBE_TIMEOUT_MS);
  });

  try {
    await Promise.race([getDb().execute(sql`select 1`), timeout]);
    return true;
  } catch {
    // No binding on purpose. See the leak rules above.
    console.error('[health] database probe failed');
    return false;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function GET() {
  const healthy = await databaseIsReachable();

  if (!healthy) {
    return new Response(JSON.stringify({ ok: false, error: 'dependency_unavailable' }), {
      status: 503,
      headers: NO_STORE_HEADERS,
    });
  }

  return new Response(JSON.stringify({ ok: true, checks: { database: 'ok' } }), {
    status: 200,
    headers: NO_STORE_HEADERS,
  });
}

/**
 * Monitors that use HEAD get the same status code and the same freshness
 * guarantee, without a body.
 */
export async function HEAD() {
  const healthy = await databaseIsReachable();
  return new Response(null, {
    status: healthy ? 200 : 503,
    headers: NO_STORE_HEADERS,
  });
}
