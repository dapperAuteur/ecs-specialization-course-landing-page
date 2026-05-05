import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms of Use for ECS Specialization, operated by B4C LLC / AwesomeWebStore.com.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
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
            Terms of Use
          </h1>
          <p className="text-slate-500 text-sm mb-10">
            Last updated: 2026-05-04 &nbsp;·&nbsp; Operated by B4C LLC / AwesomeWebStore.com, under
            the WitUS.online platform
          </p>

          <Section title="1. Acceptance of Terms">
            <p>
              By using the ECS Specialization site (&quot;the Site,&quot; &quot;we,&quot;
              &quot;us&quot;), you agree to these Terms of Use and our{' '}
              <Link href="/privacy" className="text-emerald-700 hover:underline">
                Privacy Policy
              </Link>
              . If you do not agree, do not use the Site.
            </p>
            <p className="mt-3">
              The Site is operated by B4C LLC and AwesomeWebStore.com, under the WitUS.online
              platform. Brand Anthony McDonald is the founder and operator. References to
              &quot;ECS Specialization,&quot; &quot;B4C LLC,&quot; &quot;AwesomeWebStore.com,&quot;
              and &quot;Brand Anthony McDonald&quot; in these terms refer collectively to the same
              operating entity and its principals.
            </p>
          </Section>

          <Section title="2. Eligibility (21+)">
            <p>
              You must be at least 21 years old to use the Site. By using the Site you represent
              that you meet this requirement. If you are under 21, you may not view course content,
              download the preview ebook, or submit any form on the Site.
            </p>
          </Section>

          <Section title="3. Educational Scope: Not Medical Advice">
            <p className="font-semibold text-amber-700">
              The ECS Specialization is science education. It is NOT medical advice, diagnosis, or
              treatment.
            </p>
            <p className="mt-3">
              All content, including the preview ebook, course materials, blog posts, and any
              communications you receive from us, is for{' '}
              <strong>informational and educational purposes only</strong>.
            </p>
            <p className="mt-3">
              <strong>
                Always consult a qualified, licensed healthcare provider before making any changes
                to your health regimen, including changes to exercise, nutrition, supplements, or
                medications. Do not disregard or delay professional medical advice based on
                anything you read or learn here.
              </strong>
            </p>
          </Section>

          <Section title="4. Course Enrollment">
            <p>
              The Site collects expressions of interest in the ECS Specialization course. Submitting
              the lead form does not enroll you in the course; it adds your email to a list that we
              use to notify you when enrollment opens.
            </p>
            <p className="mt-3">
              When paid enrollment is available, payment, refund, and access terms will be
              presented at the point of purchase. Those terms govern that transaction; these Terms
              of Use govern your use of the Site itself.
            </p>
          </Section>

          <Section title="5. Prohibited Uses">
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Use the Site for any unlawful purpose</li>
              <li>Scrape, harvest, or systematically extract data from the Site</li>
              <li>Attempt to bypass the age-verification gate</li>
              <li>Attempt to gain unauthorized access to any system or network</li>
              <li>Reproduce, redistribute, or resell course materials without written permission</li>
              <li>Impersonate another person or entity</li>
              <li>Use the Site to send unsolicited communications (spam)</li>
            </ul>
          </Section>

          <Section title="6. Intellectual Property">
            <p>
              The ECS Specialization brand, course content, ebook, site design, and proprietary
              code are owned by B4C LLC / AwesomeWebStore.com. You may not use our trademarks,
              branding, or course materials without written permission.
            </p>
          </Section>

          <Section title="7. Disclaimers and Limitation of Liability">
            <p>
              THE SITE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES
              OF ANY KIND, EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, ECS
              SPECIALIZATION, B4C LLC, AWESOMEWEBSTORE.COM, AND BRAND ANTHONY MCDONALD DISCLAIM ALL
              WARRANTIES, INCLUDING FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT.
            </p>
            <p className="mt-3">
              IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL
              DAMAGES ARISING FROM YOUR USE OF THE SITE OR YOUR RELIANCE ON ANY CONTENT PROVIDED
              THROUGH THE SITE.
            </p>
          </Section>

          <Section title="8. Changes to These Terms">
            <p>
              We may update these Terms at any time. We will notify you of material changes by
              email (if you have given us your email) or by updating the &quot;Last updated&quot;
              date at the top of this page. Continued use after changes take effect constitutes
              your acceptance of the updated Terms.
            </p>
          </Section>

          <Section title="9. Governing Law">
            <p>
              These Terms are governed by the laws of the State of Indiana, United States, without
              regard to its conflict of law provisions.
            </p>
          </Section>

          <Section title="10. Contact">
            <p>
              Questions about these Terms? Contact us at{' '}
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
