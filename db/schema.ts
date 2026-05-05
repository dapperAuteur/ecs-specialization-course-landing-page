import { pgTable, uuid, text, jsonb, timestamp, boolean, index } from 'drizzle-orm/pg-core';

/**
 * Lead capture table. One row per public form submission (people opting in
 * for enrollment notifications).
 *
 * The ebook is decoupled from this table: it's served publicly (gated only
 * by the 21+ attestation cookie) and not tied to a lead row. Downloads are
 * tracked separately in the `download_log` table below.
 *
 * `keap_contact_id` deferred to backlog (see plans/future/keap-integration.md).
 */
export const lead = pgTable('lead', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  phone: text('phone'),
  interest: text('interest'),
  industryRoles: jsonb('industry_roles').$type<string[]>(),
  ip: text('ip'),
  userAgent: text('user_agent'),
  recaptchaScore: text('recaptcha_score'),
  receivedAt: timestamp('received_at', { withTimezone: true }).notNull().defaultNow(),
  sentToInboxAt: timestamp('sent_to_inbox_at', { withTimezone: true }),
  ageAttested: boolean('age_attested').notNull().default(false),
  consentLog: jsonb('consent_log').$type<{
    attested_at: string;
    ip: string | null;
    user_agent: string | null;
    session_id: string;
  }>(),
});

export type Lead = typeof lead.$inferSelect;
export type NewLead = typeof lead.$inferInsert;

/**
 * Download log. One row per ebook download served by app/ebook/[slug]/route.ts.
 *
 * `session_id` is the opaque UUID from the 21+ age-gate cookie. It correlates
 * with `lead.consent_log.session_id` when the same browser later submits the
 * lead form, so a join across the two surfaces a downloads-then-subscribed
 * funnel without any direct email→download mapping at insert time.
 *
 * Index on (slug, downloaded_at desc) speeds up time-series counts:
 *   SELECT COUNT(*) FROM download_log WHERE slug = $1 AND downloaded_at > $2
 */
export const downloadLog = pgTable(
  'download_log',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull(),
    sessionId: text('session_id'),
    ip: text('ip'),
    userAgent: text('user_agent'),
    downloadedAt: timestamp('downloaded_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('download_log_slug_time_idx').on(table.slug, table.downloadedAt.desc())],
);

export type DownloadLog = typeof downloadLog.$inferSelect;
export type NewDownloadLog = typeof downloadLog.$inferInsert;
