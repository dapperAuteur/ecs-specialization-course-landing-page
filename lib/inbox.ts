import { createHmac, timingSafeEqual } from 'node:crypto';
import { getEnv } from './env';

/**
 * Outbound HMAC-signed webhook to inbox.witus.online/api/ingest.
 *
 * Contract (mirrored on the receiver in witus-inbox/lib/ingest-sources.ts):
 *
 *   POST {INBOX_INGEST_URL}
 *   Headers:
 *     Content-Type:        application/json
 *     X-Witus-Source:      betterbud-ecs
 *     X-Witus-Timestamp:   <unix seconds; receiver enforces 5-min skew>
 *     X-Witus-Signature:   <hex HMAC-SHA256 over `${ts}.${rawBody}`
 *                           keyed on INBOX_INGEST_SECRET>
 *   Body:
 *     {form_type, submitter_email, submitter_name, priority, payload}
 *
 * Dev fallback: when INBOX_* env vars are unset and NODE_ENV is
 * 'development', skip the network call and return ok:true with a
 * dev-log marker. Production paths fail closed.
 */

export interface IngestPayload {
  form_type: 'specialization-lead';
  submitter_email: string;
  submitter_name: string;
  priority: 'high' | 'normal' | 'low';
  payload: Record<string, unknown>;
}

export interface IngestResult {
  ok: boolean;
  status?: number;
  detail?: string;
}

interface InboxConfig {
  url: string;
  secret: string;
  source: string;
}

function readConfig(): InboxConfig | null {
  try {
    const env = getEnv();
    return {
      url: env.INBOX_INGEST_URL,
      secret: env.INBOX_INGEST_SECRET,
      source: env.INBOX_SOURCE_SLUG,
    };
  } catch {
    return null;
  }
}

export function signRequest(timestamp: string, rawBody: string, secret: string): string {
  return createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex');
}

/**
 * Constant-time comparison helper. Exposed for tests + parity with the
 * receiver-side verify path.
 */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export async function postToInbox(payload: IngestPayload): Promise<IngestResult> {
  const config = readConfig();
  if (!config) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[inbox] dev-log fallback (INBOX_* env unset):', {
        form_type: payload.form_type,
        submitter_email: payload.submitter_email,
        priority: payload.priority,
      });
      return { ok: true, detail: 'dev-log' };
    }
    return { ok: false, detail: 'INBOX_* env vars missing' };
  }

  const rawBody = JSON.stringify(payload);
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = signRequest(timestamp, rawBody, config.secret);

  let res: Response;
  try {
    res = await fetch(config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Witus-Source': config.source,
        'X-Witus-Timestamp': timestamp,
        'X-Witus-Signature': signature,
      },
      body: rawBody,
    });
  } catch (err) {
    return { ok: false, detail: `network error: ${(err as Error).message}` };
  }

  if (!res.ok) {
    return { ok: false, status: res.status, detail: `inbox returned ${res.status}` };
  }
  return { ok: true, status: res.status };
}
