import { CheckCircle } from 'lucide-react';

const findings = [
  'ECS regulates mood disorders, anxiety, and depression (PMC, 2023)',
  'Modulates food intake and metabolic function (Nature, 2024)',
  'Crucial for synaptic plasticity and learning (Int J Mol Sci, 2024)',
  'Genetic variation alters individual ECS sensitivity',
];

export default function ScientificEvidence() {
  return (
    <section aria-labelledby="evidence-heading" className="py-16 sm:py-20 bg-emerald-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 id="evidence-heading" className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 sm:mb-8 text-center">
            Backed by current research
          </h2>
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-3 sm:mb-4">
                  Recent peer-reviewed findings
                </h3>
                <ul className="space-y-3 sm:space-y-4">
                  {findings.map((f) => (
                    <li key={f} className="flex items-start">
                      <CheckCircle
                        className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 mr-3 mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-slate-700 text-sm sm:text-base">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-3 sm:mb-4">
                  Why this matters
                </h3>
                <div className="bg-emerald-50 rounded-lg p-4 sm:p-6">
                  <p className="text-slate-700 mb-3 sm:mb-4 text-sm sm:text-base">
                    Over 12,000 papers on endocannabinoids have been published since 2000, yet the
                    system rarely appears in healthcare training.
                  </p>
                  <p className="text-slate-700 font-semibold text-sm sm:text-base">
                    The specialization gives you knowledge most clinicians lack.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
