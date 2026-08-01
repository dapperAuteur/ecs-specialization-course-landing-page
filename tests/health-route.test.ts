import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Tests for `/api/health`.
 *
 * The point of this suite is the leak guarantee, not the happy path. A database
 * failure carries the Neon connection string, password included, in its message,
 * so the assertions below check what is ABSENT from the 503 as hard as they check
 * what is present in the 200.
 *
 * The credential-shaped fixture is assembled from fragments at runtime, matching
 * the rule in `sentry-scrub.test.ts`: a realistic secret written as one literal
 * gets the push rejected by GitHub secret scanning.
 */

const { execute } = vi.hoisted(() => ({ execute: vi.fn() }));

vi.mock('@/lib/db', () => ({ getDb: () => ({ execute }) }));

// Static import, not a per-test dynamic one: `vi.mock` is hoisted above imports, so the mock is
// already in place here, and pulling drizzle in from inside a test body costs enough to blow the
// default 5s per-test timeout on a cold worker.
import { GET, HEAD } from '@/app/api/health/route';

const PASSWORD = ['np', 'g_', 'fakeSecret', '1234'].join('');
const CONNECTION_STRING = `postgres://user:${PASSWORD}@ep-fake.neon.tech/db`;

describe('/api/health', () => {
  beforeEach(() => {
    execute.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('returns 200 and ok:true when the database answers', async () => {
    execute.mockResolvedValue([{ '?column?': 1 }]);

    const res = await GET();

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true, checks: { database: 'ok' } });
  });

  it('is never cached, so a monitor cannot be shown a stale green', async () => {
    execute.mockResolvedValue([{ '?column?': 1 }]);

    const res = await GET();

    expect(res.headers.get('cache-control')).toContain('no-store');
  });

  it('returns 503 with a fixed token when the database fails', async () => {
    execute.mockRejectedValue(new Error(`connect ECONNREFUSED ${CONNECTION_STRING}`));

    const res = await GET();

    expect(res.status).toBe(503);
    await expect(res.json()).resolves.toEqual({ ok: false, error: 'dependency_unavailable' });
  });

  it('never lets the raw error or the connection secret reach the body', async () => {
    execute.mockRejectedValue(new Error(`connect ECONNREFUSED ${CONNECTION_STRING}`));

    const body = await (await GET()).text();

    expect(body).not.toContain(PASSWORD);
    expect(body).not.toContain('neon.tech');
    expect(body).not.toContain('ECONNREFUSED');
    // Counter-assertion: it still says something a monitor can key on.
    expect(body).toContain('dependency_unavailable');
  });

  it('logs a constant string, never the error message', async () => {
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {});
    execute.mockRejectedValue(new Error(`connect ECONNREFUSED ${CONNECTION_STRING}`));

    await GET();

    const lines = logged.mock.calls.flat().join(' ');
    expect(lines).toBe('[health] database probe failed');
    expect(lines).not.toContain(PASSWORD);
  });

  it('gives up on a hung probe after 4 seconds instead of hanging the monitor', async () => {
    vi.useFakeTimers();
    execute.mockReturnValue(new Promise(() => {}));

    const pending = GET();
    await vi.advanceTimersByTimeAsync(4000);
    const res = await pending;

    expect(res.status).toBe(503);
  });

  it('answers HEAD with the same status and no body', async () => {
    execute.mockResolvedValue([{ '?column?': 1 }]);

    const res = await HEAD();

    expect(res.status).toBe(200);
    expect(res.body).toBeNull();
    expect(res.headers.get('cache-control')).toContain('no-store');
  });
});
