import Link from "next/link";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";

// Error pages keep the app shell (witus docs/shared-ui-ux-dx.md): this landing page has no accounts,
// so its shell is the site header (course name + section links) and the ecosystem footer. Without
// this file a missing path got the bare Next.js 404 with no way back.
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="mx-auto w-full max-w-xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Page not found</h1>
          <p className="mt-4 text-slate-700">That page does not exist or has moved.</p>
          <Link
            href="/"
            className="mt-8 inline-flex min-h-11 items-center rounded-md px-4 font-semibold text-emerald-800 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
          >
            Back to the course page
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
