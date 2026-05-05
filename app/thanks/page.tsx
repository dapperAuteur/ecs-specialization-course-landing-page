import Link from 'next/link';
import { CheckCircle, Download } from 'lucide-react';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Thanks',
  robots: { index: false, follow: false },
};

interface ThanksPageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function ThanksPage({ searchParams }: ThanksPageProps) {
  const params = await searchParams;
  const email = params.email ?? '';

  return (
    <>
      <main id="main" className="flex-1 bg-emerald-50">
        <div className="container mx-auto px-6 py-16 sm:py-24">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-6 sm:p-10 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" aria-hidden="true" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">
              You&apos;re on the list.
            </h1>
            {email && (
              <p className="text-sm sm:text-base text-slate-600 mb-5 sm:mb-6">
                We&apos;ll send course updates to{' '}
                <span className="font-semibold text-slate-800">{email}</span>.
              </p>
            )}

            <div className="bg-slate-50 rounded-lg p-4 sm:p-6 text-left mb-5 sm:mb-6">
              <p className="text-slate-700 text-sm sm:text-base">
                Look for an email from us when the May 2026 cohort opens for sign-ups. In the
                meantime, the preview ebook is yours to read.
              </p>
            </div>

            <a
              href="/ebook/ecs-specialization"
              className="inline-flex items-center justify-center gap-2 min-h-11 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 mb-5 sm:mb-6"
            >
              <Download className="w-5 h-5" aria-hidden="true" />
              <span>Download the preview ebook</span>
            </a>

            <div>
              <Link
                href="/"
                className="text-sm sm:text-base text-emerald-700 hover:text-emerald-900 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 rounded"
              >
                ← Back to the course page
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
