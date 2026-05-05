export default function Footer() {
  return (
    <footer className="py-10 sm:py-12 bg-slate-900 text-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
          ECS Specialization
        </h2>
        <p className="text-slate-300 mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base">
          The science of the endocannabinoid system. Receptor biology, endogenous ligands, and
          signaling, taught as a specialization.
        </p>

        <nav aria-label="Ecosystem links" className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6 text-sm text-slate-300">
          <a
            href="https://centenarianos.com"
            className="hover:text-emerald-300 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 rounded"
            target="_blank"
            rel="noopener noreferrer"
          >
            CentenarianOS
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a
            href="https://brandanthonymcdonald.com"
            className="hover:text-emerald-300 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 rounded"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instructor portfolio
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </nav>

        <p className="text-xs sm:text-sm text-amber-300 max-w-2xl mx-auto mb-3 sm:mb-4">
          Educational content. 21+. Not medical advice.
        </p>
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} B4C LLC / AwesomeWebStore.com. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
