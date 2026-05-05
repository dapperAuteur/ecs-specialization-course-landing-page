import { pgTable, uuid, text, jsonb, timestamp, boolean } from 'drizzle-orm/pg-core';

/**
 * Lead capture table. One row per public form submission.
 *
 * Schema rationale: fields preserved from the prior Mongoose model (firstName/lastName
 * flattened to single `name`; phone/interest/industry_roles preserved as ECS-specific
 * custom fields). Compliance fields (age_attested, consent_log) added per ecosystem
 * guardrails §3 + the 21+ requirement on this repo. Integration fields
 * (sent_to_inbox_at, ebook_delivered_at) added for the Phase 6/8 webhook + ebook
 * delivery flows. `keap_contact_id` deferred to backlog (see plans/future/keap-
 * integration.md once it lands in Phase 12).
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
  ebookDeliveredAt: timestamp('ebook_delivered_at', { withTimezone: true }),
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
