/**
 * PII-safe wrapper for DB writes. Postgres constraint errors
 * (unique_violation, check_violation) include the offending column values in
 * the error detail field by default, which leaks PII into logs and Sentry.
 * Server actions never call `db.insert(...)` directly on PII tables — they go
 * through `safeWrite()`.
 *
 * On error: caller gets a generic { ok: false, code } back; the original
 * error is logged with PII redacted.
 */

export type SafeResult<T> =
  | { ok: true; data: T }
  | { ok: false; code: 'duplicate' | 'validation' | 'unknown' };

interface PgErrorLike {
  code?: string;
  detail?: string;
  message?: string;
}

export async function safeWrite<T>(label: string, op: () => Promise<T>): Promise<SafeResult<T>> {
  try {
    const data = await op();
    return { ok: true, data };
  } catch (err) {
    const e = err as PgErrorLike;
    // Postgres SQLSTATE codes — see https://www.postgresql.org/docs/current/errcodes-appendix.html
    if (e?.code === '23505') {
      console.warn(`[db-safe] ${label}: unique_violation (PII redacted)`);
      return { ok: false, code: 'duplicate' };
    }
    if (e?.code?.startsWith('23')) {
      console.warn(`[db-safe] ${label}: integrity violation ${e.code} (PII redacted)`);
      return { ok: false, code: 'validation' };
    }
    console.error(`[db-safe] ${label}: ${e?.code ?? 'unknown'} (PII redacted; message: ${(e?.message ?? '').slice(0, 100)})`);
    return { ok: false, code: 'unknown' };
  }
}
