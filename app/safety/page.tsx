import Link from 'next/link';
import { LifeBuoy, Phone } from 'lucide-react';
import Footer from '@/components/Footer';
import RiseWellnessCard from '@/components/RiseWellnessCard';

export const metadata = {
  title: 'Safety & Resources',
  description:
    'Mental health and crisis support resources. If you are in crisis, call or text 988 (US Suicide & Crisis Lifeline).',
  alternates: { canonical: '/safety' },
};

export default function SafetyPage() {
  return (
    <>
      <main id="main" className="flex-1 bg-slate-50">
        <div className="container mx-auto px-6 py-12 sm:py-16 max-w-3xl">
          <header className="mb-8 sm:mb-10">
            <Link
              href="/"
              className="text-sm text-emerald-700 hover:text-emerald-900 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 rounded"
            >
              ← Back to the course page
            </Link>
            <h1 className="mt-3 sm:mt-4 text-3xl sm:text-4xl font-bold text-slate-900">
              Safety &amp; Resources
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-600">
              The ECS Specialization is science education, not medical or mental health care. If
              what you are dealing with is bigger than this site, the resources below can help.
            </p>
          </header>

          <section
            aria-label="Crisis resources"
            className="bg-red-50 border-l-4 border-red-400 rounded-xl p-5 sm:p-6 shadow-sm mb-6 sm:mb-8"
          >
            <div className="flex items-center gap-2 mb-2">
              <LifeBuoy className="w-4 h-4 text-red-700 shrink-0" aria-hidden="true" />
              <h2 className="text-sm font-semibold text-red-800">If you are in crisis</h2>
            </div>
            <p className="text-sm text-slate-800 mb-3 leading-relaxed">
              In the US, the Suicide &amp; Crisis Lifeline is available 24/7. Call or text:
            </p>
            <div className="flex items-center gap-2 text-base font-semibold">
              <Phone className="w-4 h-4 text-red-700 shrink-0" aria-hidden="true" />
              <a
                href="tel:988"
                aria-label="Call 988, the Suicide and Crisis Lifeline"
                className="text-red-800 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 rounded"
              >
                988
              </a>
            </div>
          </section>

          <RiseWellnessCard />

          <section
            aria-label="Educational scope reminder"
            className="mt-6 sm:mt-8 text-sm text-slate-500"
          >
            <p>
              This page mirrors the safety convention used across the WitUS ecosystem. The ECS
              Specialization course covers science, not clinical care. Always consult a qualified
              clinician for medical or mental health questions.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
