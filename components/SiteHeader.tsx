import Link from 'next/link';

/**
 * The landing page's own header: the course name linking home, plus the same section links the
 * footer's "ECS Specialization" column uses. It renders on the home page and on the error pages so a
 * lost visitor sees the site's shell (witus docs/shared-ui-ux-dx.md, "Error pages keep the app
 * shell"). This site has no accounts, so there is no Sign in control.
 */
const NAV_LINKS = [
  { href: '/#faq', label: 'FAQ' },
  { href: '/ebook/ecs-specialization', label: 'Free ebook' },
  { href: '/#lead-form', label: 'Notify me' },
  { href: '/safety', label: 'Safety' },
] as const;

const navLinkClasses =
  'inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-slate-700 hover:text-emerald-800 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600';

export default function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-1 px-6 py-2">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-md font-extrabold tracking-wide text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
        >
          ECS Specialization
        </Link>
        <nav aria-label="Site" className="-mx-3 flex flex-wrap items-center">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={navLinkClasses}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
