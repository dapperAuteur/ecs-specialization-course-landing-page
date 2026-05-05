import { Brain, CheckCircle, Activity, Utensils } from 'lucide-react';

const tracks = [
  {
    Icon: Utensils,
    title: 'Nutrition for ECS tone',
    description:
      'Foods that supply endocannabinoid building blocks and support CB2 receptor function.',
    highlights: ['Omega-3 fatty acids', 'Anti-inflammatory diet patterns', 'Micronutrient cofactors'],
  },
  {
    Icon: Activity,
    title: 'Fitness for ECS activation',
    description:
      'Exercise protocols that measurably elevate anandamide and 2-AG.',
    highlights: ["Runner's-high physiology", 'HIIT + endocannabinoids', 'Recovery + sleep optimization'],
  },
  {
    Icon: Brain,
    title: 'Neuroscience foundations',
    description:
      'Mindfulness and brain-training to optimize retrograde signaling and synaptic plasticity.',
    highlights: ['Meditation effects on ECS', 'Stress + cortisol crosstalk', 'Cognitive performance'],
  },
];

export default function SpecializationTracks() {
  return (
    <section aria-labelledby="tracks-heading" className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10 sm:mb-16">
          <h2 id="tracks-heading" className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Three specialization tracks
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
            How fitness, nutrition, and neuroscience interact within the endocannabinoid system.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {tracks.map(({ Icon, title, description, highlights }) => (
            <div
              key={title}
              className="bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-xl p-6 sm:p-8 hover:shadow-2xl transition-shadow border border-slate-100"
            >
              <div className="text-center mb-4 sm:mb-6">
                <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600 mx-auto" aria-hidden="true" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4 text-center">
                {title}
              </h3>
              <p className="text-slate-600 mb-4 sm:mb-6 text-center text-sm sm:text-base">{description}</p>
              <ul className="space-y-2 sm:space-y-3">
                {highlights.map((h) => (
                  <li key={h} className="flex items-center text-slate-700 text-sm sm:text-base">
                    <CheckCircle
                      className="w-5 h-5 text-emerald-600 mr-3 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
