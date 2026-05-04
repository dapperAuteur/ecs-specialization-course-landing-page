'use server';

import { after } from 'next/server';
import { headers } from 'next/headers';
import { z } from 'zod';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { verifyAgeGate } from '@/lib/age-gate';
import { mintDownloadUrl } from '@/lib/ebook';
import { postToInbox } from '@/lib/inbox';
import { safeWrite } from '@/lib/db-safe';
import { getDb } from '@/lib/db';
import { lead } from '@/db/schema';

const submissionSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  name: z.string().trim().min(1).max(120),
  phone: z
    .string()
    .trim()
    .max(40)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  interest: z
    .enum(['fitness', 'nutrition', 'neuroscience', 'complete', 'business'])
    .optional()
    .transform((v) => v ?? undefined),
  industryRoles: z
    .array(z.enum(['Industry Professional', 'Naturopathic Doctor', 'Medical Doctor']))
    .max(3)
    .default([]),
  recaptchaToken: z.string().min(1),
});

export type SubmissionInput = z.input<typeof submissionSchema>;

export type SubmissionResult =
  | { ok: true; redirectTo: string }
  | { ok: false; code: 'invalid' | 'recaptcha' | 'age-gate' | 'duplicate' | 'server-error'; message: string };

export async function submitLead(input: SubmissionInput): Promise<SubmissionResult> {
  // 1. Zod-validate
  const parsed = submissionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, code: 'invalid', message: 'Please fill out all required fields correctly.' };
  }
  const data = parsed.data;

  // 2. reCAPTCHA verify
  const captcha = await verifyRecaptcha(data.recaptchaToken);
  if (!captcha.ok) {
    const message =
      captcha.reason === 'low-score'
        ? "We couldn't verify you as human. Please try again."
        : 'Verification failed. Please refresh and try again.';
    return { ok: false, code: 'recaptcha', message };
  }

  // 3. Age-gate verify (Phase 9 makes this load-bearing)
  const gate = await verifyAgeGate();
  if (!gate.ok) {
    return {
      ok: false,
      code: 'age-gate',
      message: 'Please confirm you are 21 or older before submitting.',
    };
  }

  // 4. Capture request context for the lead row + downstream logging
  const headerStore = await headers();
  const ip =
    headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headerStore.get('x-real-ip') ??
    null;
  const userAgent = headerStore.get('user-agent') ?? null;

  // 5. PII-safe insert
  const db = getDb();
  const inserted = await safeWrite('lead.insert', () =>
    db
      .insert(lead)
      .values({
        email: data.email,
        name: data.name,
        phone: data.phone,
        interest: data.interest,
        industryRoles: data.industryRoles.length > 0 ? data.industryRoles : null,
        ip,
        userAgent,
        recaptchaScore: captcha.score?.toFixed(2),
        ageAttested: true,
        consentLog: gate.attestedAt
          ? {
              attested_at: gate.attestedAt,
              ip,
              user_agent: userAgent,
              session_id: gate.sessionId ?? 'unknown',
            }
          : null,
      })
      .returning({ id: lead.id }),
  );

  if (!inserted.ok) {
    const message =
      inserted.code === 'duplicate'
        ? "This email is already on the list — we'll be in touch."
        : 'Something went wrong on our end. Please try again in a minute.';
    return { ok: false, code: inserted.code === 'duplicate' ? 'duplicate' : 'server-error', message };
  }

  const leadId = inserted.data[0]!.id;

  // 6. Mint ebook URL (Phase 8 stub for now)
  const minted = mintDownloadUrl({ slug: 'ecs-specialization', leadId });

  // 7. Fire inbox webhook in the background (Phase 6 stub for now)
  after(async () => {
    const result = await postToInbox({
      form_type: 'specialization-lead',
      submitter_email: data.email,
      submitter_name: data.name,
      priority: 'high',
      payload: {
        phone: data.phone,
        interest: data.interest,
        industry_roles: data.industryRoles,
        recaptcha_score: captcha.score,
        age_attested: true,
      },
    });
    if (!result.ok) {
      console.error('[lead.submit] inbox webhook failed:', result.detail);
    }
  });

  // 8. Redirect target carries the email (for /thanks UX) + the download URL
  const redirectTo = `/thanks?email=${encodeURIComponent(data.email)}&download=${encodeURIComponent(minted.url)}`;
  return { ok: true, redirectTo };
}
