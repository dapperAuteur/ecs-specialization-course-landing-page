export default function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900"
    >
      <div className="absolute inset-0 bg-black opacity-50" aria-hidden="true" />
      <div className="absolute inset-0 motion-safe:animate-pulse opacity-10" aria-hidden="true">
        <div className="absolute top-20 left-10 w-48 h-48 sm:w-64 sm:h-64 bg-emerald-500 rounded-full" />
        <div className="absolute bottom-20 right-10 w-32 h-32 sm:w-48 sm:h-48 bg-teal-500 rounded-full" />
      </div>

      <div className="relative container mx-auto px-6 py-16 sm:py-24">
        <div className="text-center text-white">
          <h1 id="hero-heading" className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Master the Science of the
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">
              Endocannabinoid System
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-4xl mx-auto opacity-90">
            The signaling system that regulates mood, sleep, appetite, immunity, and learning. Most
            healthcare curricula don&apos;t teach it.
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8">
            <span className="bg-white/15 backdrop-blur-sm rounded-lg px-4 sm:px-6 py-2 sm:py-3 text-emerald-200 font-semibold text-sm sm:text-base">
              Science-Based
            </span>
            <span className="bg-white/15 backdrop-blur-sm rounded-lg px-4 sm:px-6 py-2 sm:py-3 text-teal-200 font-semibold text-sm sm:text-base">
              40+ Years Research
            </span>
            <span className="bg-white/15 backdrop-blur-sm rounded-lg px-4 sm:px-6 py-2 sm:py-3 text-emerald-200 font-semibold text-sm sm:text-base">
              Specialization Program
            </span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a
              href="/ebook/ecs-specialization"
              className="inline-block min-h-11 px-8 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Download the free ebook
            </a>
            <a
              href="#lead-form"
              className="inline-block min-h-11 px-8 py-3 rounded-lg bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Notify me when enrollment opens
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
