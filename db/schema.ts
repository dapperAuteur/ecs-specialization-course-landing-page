import { pgTable, uuid, text, jsonb, timestamp, boolean } from 'drizzle-orm/pg-core';

/**
 * Lead capture table. One row per public form submission (people opting in
 * for enrollment notifications).
 *
 * The ebook is decoupled from this table: it's served publicly (gated only
 * by the 21+ attestation cookie) and not tied to a lead row. If we ever
 * want per-download analytics, add a separate `download_log` table or
 * re-introduce `ebook_delivered_at` here.
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
