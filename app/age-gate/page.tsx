import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { attestAdult } from './actions';

export const metadata = {
  title: 'Age verification',
  robots: { index: false, follow: false },
};

interface AgeGatePageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function AgeGatePage({ searchParams }: AgeGatePageProps) {
  const { next = '/' } = await searchParams;

  return (
    <main id="main" className="flex-1 flex items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 px-6 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-center">
        <div
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5"
          aria-hidden="true"
        >
          <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-700" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">
          Are you 21 or older?
        </h1>
        <p className="text-slate-600 mb-6 sm:mb-8 text-sm sm:text-base">
          This site provides science education on the endocannabinoid system. Access requires
          confirming you are 21 years of age or older.
        </p>

        <form action={attestAdult} className="space-y-3">
          <input type="hidden" name="next" value={next} />
          <button
            type="submit"
            className="w-full min-h-11 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            Yes, I am 21 or older
          </button>
          <Link
            href="/age-gate/under-21"
            className="block w-full min-h-11 py-3 px-6 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            No, I am under 21
          </Link>
        </form>

        <p className="text-xs text-slate-500 mt-5 sm:mt-6">
          Educational content. Not medical advice.
        </p>
      </div>
    </main>
  );
}
