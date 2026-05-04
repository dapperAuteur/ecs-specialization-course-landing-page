'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { ArrowRight, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { submitLead, type SubmissionResult } from '@/app/actions';

const formSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
  name: z.string().trim().min(1, 'Name is required').max(120),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  interest: z.enum(['', 'fitness', 'nutrition', 'neuroscience', 'complete', 'business']).optional(),
  industryRoles: z.array(z.string()).default([]),
});
type FormValues = z.input<typeof formSchema>;

const INTEREST_OPTIONS = [
  { value: 'fitness', label: 'Fitness & ECS Activation' },
  { value: 'nutrition', label: 'Nutrition for ECS Optimization' },
  { value: 'neuroscience', label: 'Neuroscience & Mindfulness' },
  { value: 'complete', label: 'Complete Specialization Program' },
  { value: 'business', label: 'Team / Company Training' },
] as const;

const ROLE_OPTIONS = [
  'Industry Professional',
  'Naturopathic Doctor',
  'Medical Doctor',
] as const;

export default function LeadForm() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', name: '', phone: '', interest: '', industryRoles: [] },
  });

  const onSubmit = handleSubmit((values) => {
    setSubmitError(null);

    startTransition(async () => {
      try {
        let token: string | null = null;
        if (executeRecaptcha) {
          token = await executeRecaptcha('submit_lead');
        }
        if (!token) {
          if (process.env.NODE_ENV === 'development') {
            token = 'dev-bypass';
          } else {
            setSubmitError('Verification is still loading. Please try again in a moment.');
            return;
          }
        }

        const result: SubmissionResult = await submitLead({
          email: values.email,
          name: values.name,
          phone: values.phone || undefined,
          interest: values.interest && values.interest.length > 0 ? values.interest : undefined,
          industryRoles: (values.industryRoles ?? []) as ('Industry Professional' | 'Naturopathic Doctor' | 'Medical Doctor')[],
          recaptchaToken: token,
        });

        if (result.ok) {
          router.push(result.redirectTo);
        } else {
          setSubmitError(result.message);
        }
      } catch (err) {
        console.error('[LeadForm] submit failed:', err);
        setSubmitError('Something went wrong. Please try again in a minute.');
      }
    });
  });

  const fieldErrorClass = 'mt-1 text-sm text-red-700';
  const inputClass =
    'w-full px-4 py-3 min-h-11 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500';

  return (
    <form onSubmit={onSubmit} className="space-y-5 sm:space-y-6 text-left" noValidate>
      <div>
        <label htmlFor="lf-name" className="block text-sm font-semibold text-slate-700 mb-1">
          Name <span aria-hidden="true">*</span>
          <span className="sr-only">required</span>
        </label>
        <input
          id="lf-name"
          type="text"
          autoComplete="name"
          aria-invalid={errors.name ? 'true' : undefined}
          aria-describedby={errors.name ? 'lf-name-err' : undefined}
          className={inputClass}
          placeholder="Your name"
          {...register('name')}
        />
        {errors.name && (
          <p id="lf-name-err" className={fieldErrorClass}>
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="lf-email" className="block text-sm font-semibold text-slate-700 mb-1">
          Email <span aria-hidden="true">*</span>
          <span className="sr-only">required</span>
        </label>
        <input
          id="lf-email"
          type="email"
          autoComplete="email"
          aria-invalid={errors.email ? 'true' : undefined}
          aria-describedby={errors.email ? 'lf-email-err' : undefined}
          className={inputClass}
          placeholder="you@example.com"
          {...register('email')}
        />
        {errors.email && (
          <p id="lf-email-err" className={fieldErrorClass}>
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="lf-phone" className="block text-sm font-semibold text-slate-700 mb-1">
          Phone <span className="text-slate-500 text-xs font-normal">(optional)</span>
        </label>
        <input
          id="lf-phone"
          type="tel"
          autoComplete="tel"
          className={inputClass}
          placeholder="(555) 123-4567"
          {...register('phone')}
        />
      </div>

      <div>
        <label htmlFor="lf-interest" className="block text-sm font-semibold text-slate-700 mb-1">
          Primary interest <span className="text-slate-500 text-xs font-normal">(optional)</span>
        </label>
        <select id="lf-interest" className={inputClass} {...register('interest')}>
          <option value="">Select your main interest…</option>
          {INTEREST_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="space-y-2">
        <legend className="block text-sm font-semibold text-slate-700 mb-2">
          Which best describes you?{' '}
          <span className="text-slate-500 text-xs font-normal">(optional, select any)</span>
        </legend>
        <div className="grid sm:grid-cols-2 gap-2">
          {ROLE_OPTIONS.map((role) => (
            <label
              key={role}
              className="flex items-center gap-3 px-3 py-2 min-h-11 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              <input
                type="checkbox"
                value={role}
                className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
                {...register('industryRoles')}
              />
              <span className="text-sm text-slate-800">{role}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {submitError && (
        <div
          role="alert"
          className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded-md flex items-start gap-3"
        >
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <span>{submitError}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full min-h-11 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-colors flex items-center justify-center gap-2 text-base sm:text-lg disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
      >
        {isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            <span>Submitting…</span>
          </>
        ) : (
          <>
            <span>Get the free preview ebook</span>
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </>
        )}
      </button>

      <p className="text-xs text-slate-500 text-center flex items-start justify-center gap-2">
        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <span>
          This site is protected by reCAPTCHA. The Google{' '}
          <a
            href="https://policies.google.com/privacy"
            className="underline hover:text-slate-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>{' '}
          and{' '}
          <a
            href="https://policies.google.com/terms"
            className="underline hover:text-slate-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Service
          </a>{' '}
          apply.
        </span>
      </p>
    </form>
  );
}
