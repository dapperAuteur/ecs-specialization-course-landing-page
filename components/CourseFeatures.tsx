import { Brain, Network, Dna, Activity } from 'lucide-react';

const features = [
  {
    Icon: Brain,
    title: 'A signaling system in every mammal',
    description:
      'The endocannabinoid system is present in every human body — and missing from most medical curricula.',
  },
  {
    Icon: Dna,
    title: 'Endogenous ligands',
    description:
      'Anandamide and 2-AG are produced on demand to modulate neurons, immune cells, and metabolism.',
  },
  {
    Icon: Network,
    title: 'Retrograde signaling',
    description:
      'The only signaling pathway in the brain that runs post-synapse to pre-synapse — central to learning and plasticity.',
  },
  {
    Icon: Activity,
    title: 'Lifestyle activation',
    description:
      'Fitness, nutrition, and mindfulness protocols measurably influence ECS tone — no exogenous compounds required.',
  },
];

export default function CourseFeatures() {
  return (
    <section aria-labelledby="features-heading" className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10 sm:mb-16">
          <h2 id="features-heading" className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            What you&apos;ll master
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
            40+ years of receptor biology, distilled into a working clinician&apos;s framework.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map(({ Icon, title, description }) => (
            <div key={title} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-slate-100">
              <Icon className="w-8 h-8 text-emerald-600 mb-4" aria-hidden="true" />
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 sm:mb-3">{title}</h3>
              <p className="text-slate-600 text-sm sm:text-base">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
