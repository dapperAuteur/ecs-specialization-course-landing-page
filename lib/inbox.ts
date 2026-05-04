/**
 * Outbound HMAC-signed webhook to inbox.witus.online/api/ingest.
 *
 * STUB (Phase 5): dev-log only. Phase 6 replaces this with the real
 * HMAC-SHA256 contract per plans/18-rebuild-fdac-ecs-landing-pages.md
 * Phase 6 + the witus-inbox INGEST_SOURCES schema:
 *
 *   POST {INBOX_INGEST_URL}
 *   Headers:
 *     X-Witus-Source:     betterbud-ecs
 *     X-Witus-Timestamp:  <unix seconds, 5-min skew tolerance>
 *     X-Witus-Signature:  <hex HMAC-SHA256 over `${ts}.${rawBody}` keyed
 *                          on INBOX_INGEST_SECRET>
 *   Body:
 *     {form_type, submitter_email, submitter_name, priority, payload}
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
  detail?: string;
}

export async function postToInbox(payload: IngestPayload): Promise<IngestResult> {
  // PHASE 6 TODO: real HMAC-signed POST
  console.log('[inbox] dev-log (Phase 6 stub):', {
    form_type: payload.form_type,
    submitter_email: payload.submitter_email,
    priority: payload.priority,
  });
  return { ok: true, detail: 'dev-log' };
}
