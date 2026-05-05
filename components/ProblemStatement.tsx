export default function ProblemStatement() {
  return (
    <section aria-labelledby="problem-heading" className="py-16 sm:py-20 bg-gradient-to-r from-amber-50 to-emerald-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 id="problem-heading" className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 sm:mb-8">
            The signaling system most medical curricula skip
          </h2>
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6 sm:mb-8">
            <p className="text-lg sm:text-xl text-slate-700 leading-relaxed mb-6">
              The endocannabinoid system regulates mood, sleep, pain, immune function, learning, and memory.
              <strong className="text-emerald-700"> Most medical schools don&apos;t teach it.</strong>
            </p>
            <p className="text-base sm:text-lg text-slate-600 mb-6">
              CB1 and CB2 receptors, anandamide, 2-AG, FAAH, and MAGL are foundational to mammalian
              homeostasis. They have been working in your body since birth, and most healthcare
              professionals receive no formal training on how the system operates.
            </p>
            <div className="bg-emerald-50 rounded-lg p-4 sm:p-6">
              <p className="text-slate-800 font-semibold text-sm sm:text-base">
                &quot;A widespread neuromodulatory network playing a major role in tuning cognitive and
                physiological processes.&quot;
                <span className="block sm:inline text-xs sm:text-sm text-slate-600 mt-2 sm:mt-0 sm:ml-2">
                  PMC Review, 2024
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
