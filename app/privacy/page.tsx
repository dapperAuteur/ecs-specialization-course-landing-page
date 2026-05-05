import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for ECS Specialization, operated by B4C LLC / AwesomeWebStore.com.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <>
      <main id="main" className="flex-1 bg-slate-50 text-slate-800">
        <div className="max-w-3xl mx-auto px-6 py-12 sm:py-16">
          <Link
            href="/"
            className="text-sm text-emerald-700 hover:text-emerald-900 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 rounded"
          >
            ← Back to the course page
          </Link>
          <h1 className="mt-3 sm:mt-4 text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            Privacy Policy
          </h1>
          <p className="text-slate-500 text-sm mb-10">
            Last updated: 2026-05-04 &nbsp;·&nbsp; Operated by B4C LLC / AwesomeWebStore.com, under
            the WitUS.online platform
          </p>

          <Section title="1. What we collect">
            <p>When you submit the lead form, we collect:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Your name and email address</li>
              <li>Your phone number (only if you choose to provide it)</li>
              <li>Your stated interest area and any role checkboxes you select</li>
              <li>
                Technical context: IP address, user-agent string, and a reCAPTCHA risk score
                (used to filter automated submissions)
              </li>
              <li>
                Your 21+ attestation timestamp and an opaque session identifier (we never store
                your birthdate)
              </li>
            </ul>
            <p className="mt-3">
              The age-verification cookie set on your browser stores only the attestation timestamp
              and session id, signed with an HMAC. It does not contain your birthdate or any
              personal information.
            </p>
          </Section>

          <Section title="2. What we do with it">
            <p>
              We use the information you submit to send you updates about the ECS Specialization
              course (when enrollment opens, course schedule, related educational content). We do
              not sell your information to third parties.
            </p>
            <p className="mt-3">
              Form submissions are forwarded to our internal inbox at{' '}
              <a href="https://inbox.witus.online" className="text-emerald-700 hover:underline">
                inbox.witus.online
              </a>{' '}
              over a signed webhook so we can review and respond. The forward includes the same
              fields shown above.
            </p>
          </Section>

          <Section title="3. Cookies">
            <p>
              We use one cookie: <code className="text-xs bg-slate-200 rounded px-1 py-0.5">ecs_age_attested</code>.
              It is HttpOnly, signed with an HMAC, and expires after 30 days. It records that you
              have confirmed you are 21+ so you do not have to attest on every page load. We do not
              use third-party tracking or advertising cookies.
            </p>
          </Section>

          <Section title="4. Analytics">
            <p>
              We use Vercel Analytics to measure aggregate traffic patterns (page views, navigation
              paths). Vercel Analytics is privacy-friendly: it does not use cookies, does not
              collect personal data, and does not build cross-site profiles.
            </p>
          </Section>

          <Section title="5. reCAPTCHA">
            <p>
              The lead form is protected by Google reCAPTCHA v3, which collects information in
              accordance with the Google{' '}
              <a
                href="https://policies.google.com/privacy"
                className="text-emerald-700 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>{' '}
              and{' '}
              <a
                href="https://policies.google.com/terms"
                className="text-emerald-700 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>
              .
            </p>
          </Section>

          <Section title="6. Your rights">
            <p>
              You can ask us to delete the data you have submitted at any time. Email{' '}
              <a href="mailto:hello@witus.online" className="text-emerald-700 hover:underline">
                hello@witus.online
              </a>{' '}
              from the address you used to subscribe and we will remove your record.
            </p>
          </Section>

          <Section title="7. Children">
            <p>
              The Site is restricted to adults 21 and older. We do not knowingly collect information
              from anyone under 21. If you believe we have collected information from a minor,
              email us and we will delete it.
            </p>
          </Section>

          <Section title="8. Changes to this Policy">
            <p>
              We may update this Policy. The &quot;Last updated&quot; date at the top reflects the
              most recent change. Material changes will also be communicated by email if you are on
              our list.
            </p>
          </Section>

          <Section title="9. Contact">
            <p>
              Questions? Email{' '}
              <a href="mailto:hello@witus.online" className="text-emerald-700 hover:underline">
                hello@witus.online
              </a>
              .
            </p>
          </Section>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-slate-900 mb-3">{title}</h2>
      <div className="text-slate-700 text-sm leading-relaxed space-y-2">{children}</div>
    </section>
  );
}
