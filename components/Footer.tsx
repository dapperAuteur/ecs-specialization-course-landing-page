import Link from 'next/link';

/**
 * WitUS ecosystem footer for ecs-specialization.betterbud.club.
 *
 * Mirrors fly.witus.online's site-footer pattern (centered product mark +
 * Rise Wellness callout + three-column grid + bottom copyright) so the
 * footer reads as part of the same ecosystem on every WitUS surface. Uses
 * ECS's emerald palette in place of Fly's sky accent.
 *
 * Sibling product list is duplicated rather than imported because each
 * WitUS app is a separate repo. Update both this file and the canonical
 * list in witus's lib/products.ts when the ecosystem changes.
 */

interface SiblingProduct {
  name: string;
  href: string;
}

const SIBLING_PRODUCTS: SiblingProduct[] = [
  { name: 'WitUS.online', href: 'https://witus.online' },
  { name: 'CentenarianOS', href: 'https://centenarianos.com' },
  { name: 'Work.WitUS', href: 'https://work.witus.online' },
  { name: 'Tour Manager OS', href: 'https://tour.witus.online' },
  { name: 'Wanderlearn', href: 'https://wanderlearn.witus.online' },
  { name: 'FlashLearnAI', href: 'https://flashlearnai.witus.online' },
  { name: 'Fly.WitUS', href: 'https://fly.witus.online' },
  { name: 'AwesomeWebStore', href: 'https://awesomewebstore.com' },
];

const linkClasses =
  'inline-flex items-center min-h-[28px] text-slate-600 hover:text-emerald-700 hover:underline transition-colors focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 rounded';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 mt-12">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col items-center text-center mb-8">
          <p className="font-extrabold text-emerald-800 tracking-wide text-lg">
            ECS SPECIALIZATION
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Endocannabinoid system science education
          </p>
        </div>

        <RiseWellnessCallout />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
          <div>
            <p className="text-slate-900 font-semibold mb-2">Ecosystem</p>
            <ul className="space-y-1">
              {SIBLING_PRODUCTS.map((p) => (
                <li key={p.href}>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClasses}
                  >
                    {p.name}
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-slate-900 font-semibold mb-2">ECS Specialization</p>
            <ul className="space-y-1">
              <li>
                <Link href="/" className={linkClasses}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#faq" className={linkClasses}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/ebook/ecs-specialization" className={linkClasses}>
                  Free preview ebook
                </Link>
              </li>
              <li>
                <Link href="/#lead-form" className={linkClasses}>
                  Notify me when enrollment opens
                </Link>
              </li>
              <li>
                <a
                  href="https://brandanthonymcdonald.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClasses}
                >
                  Instructor portfolio
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-slate-900 font-semibold mb-2">Partners &amp; Legal</p>
            <ul className="space-y-1">
              <li>
                <Link href="/safety#rise-wellness" className={linkClasses}>
                  Rise Wellness
                </Link>
                <p className="text-xs text-slate-400 leading-tight">Wellness partner</p>
              </li>
              <li className="pt-2">
                <Link href="/safety" className={linkClasses}>
                  Safety &amp; Resources
                </Link>
              </li>
              <li>
                <Link href="/terms" className={linkClasses}>
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/privacy" className={linkClasses}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a href="mailto:hello@witus.online" className={linkClasses}>
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500 text-center space-y-1">
          <p className="text-amber-700 font-semibold">
            Educational content. 21+. Not medical advice. No refunds on the course.
          </p>
          <p>
            © {year} B4C LLC. A{' '}
            <a
              href="https://awesomewebstore.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-emerald-700 hover:underline"
            >
              AwesomeWebStore.com
              <span className="sr-only"> (opens in new tab)</span>
            </a>{' '}
            brand
          </p>
        </div>
      </div>
    </footer>
  );
}

/**
 * Mental health support callout. Mirrors the Rise Wellness section at
 * https://www.centenarianos.com/safety#rise-wellness so the same partner
 * surface appears across the WitUS ecosystem. Independent provider; the
 * non-affiliation disclaimer is mandatory and stays verbatim.
 *
 * Placed above the three-column grid so mental-health resources get the
 * prominence they warrant on every page (matches fly.witus.online).
 */
function RiseWellnessCallout() {
  return (
    <section
      aria-labelledby="rise-wellness-heading"
      className="mb-8 rounded-lg border border-emerald-100 bg-emerald-50/60 p-5 text-sm"
    >
      <header className="mb-3">
        <p className="text-[11px] uppercase tracking-wide text-emerald-700 font-semibold">
          Mental health support
        </p>
        <h2 id="rise-wellness-heading" className="text-base font-semibold text-slate-900">
          Rise Wellness of Indiana
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Independent mental health provider. Not affiliated with ECS Specialization
        </p>
      </header>

      <p className="text-slate-700 leading-relaxed">
        Rise Wellness of Indiana provides compassionate, personalized, holistic mental
        health care: evidence-based medicine, trauma-informed care, and a whole-person
        approach to help you heal, grow, and thrive in mind, body, and spirit.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">
            Services
          </p>
          <ul className="text-xs text-slate-700 space-y-0.5">
            <li>ADHD testing &amp; management (in-person and from home)</li>
            <li>Anxiety &amp; depression</li>
            <li>Maternal mental health</li>
            <li>Medication management</li>
            <li>GeneSight® genetic testing</li>
            <li>Behavioral therapy &amp; coaching</li>
            <li>Routine lab testing</li>
          </ul>
        </div>

        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">
            Visit or call
          </p>
          <address className="not-italic text-xs text-slate-700 leading-relaxed">
            320 North Meridian Street
            <br />
            Indianapolis, IN 46204
            <br />
            Mon–Sat by appointment. Sun closed
          </address>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-xs">
            <a
              href="tel:+13179650299"
              className="inline-flex items-center min-h-[28px] font-medium text-emerald-700 hover:underline focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 rounded"
            >
              317-965-0299
            </a>
            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>
            <a
              href="https://risewellnessofindiana.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center min-h-[28px] font-medium text-emerald-700 hover:underline focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 rounded"
            >
              risewellnessofindiana.com
              <span className="sr-only"> (opens in new tab)</span>
            </a>
            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>
            <Link
              href="/safety#rise-wellness"
              className="inline-flex items-center min-h-[28px] font-medium text-emerald-700 hover:underline focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 rounded"
            >
              Full safety page
            </Link>
          </div>
        </div>
      </div>

      <blockquote className="mt-4 border-l-2 border-emerald-300 pl-3 text-xs italic text-slate-600">
        &ldquo;At Rise Wellness, we believe everyone has the capacity to rise above
        challenges and live a fulfilling, healthy life. Our care is guided by the
        belief that healing is personal, holistic, and rooted in compassion.&rdquo;
        <span className="block not-italic mt-1 text-slate-500">
          Rise Wellness of Indiana
        </span>
      </blockquote>

      <p className="mt-4 text-[11px] leading-relaxed text-slate-500">
        Rise Wellness of Indiana is an independent organization. They are not affiliated
        with, employed by, or endorsed by ECS Specialization, CentenarianOS, B4C LLC,
        AwesomeWebStore.com, or Brand Anthony McDonald. We are grateful for their
        collaboration on mental health safety resources for our community.
      </p>
    </section>
  );
}
