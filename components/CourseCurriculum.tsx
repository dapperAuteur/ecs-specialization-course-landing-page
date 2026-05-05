const lectures = [
  {
    number: '01',
    title: 'Discovery + receptor biology',
    description:
      'How the ECS was identified in the 1990s, why mammals have CB1 and CB2 receptors, and how they distribute across the nervous and immune systems.',
    duration: '18 min',
  },
  {
    number: '02',
    title: 'CB1 and CB2 in detail',
    description:
      'Where each receptor is expressed, the downstream pathways they modulate, and why this maps to memory, appetite, pain, and inflammation.',
    duration: '20 min',
  },
  {
    number: '03',
    title: 'Endogenous ligands',
    description:
      "Anandamide and 2-AG — the body's on-demand modulators. Synthesis, release, receptor binding, and physiological effects.",
    duration: '22 min',
  },
  {
    number: '04',
    title: 'Degradation enzymes',
    description:
      'FAAH and MAGL — how they tune signal duration, and why their genetic variants change individual ECS tone.',
    duration: '21 min',
  },
  {
    number: '05',
    title: 'Retrograde signaling',
    description:
      'The post-to-pre-synaptic communication pattern that distinguishes the ECS from every other neurotransmitter system.',
    duration: '23 min',
  },
];

export default function CourseCurriculum() {
  return (
    <section aria-labelledby="curriculum-heading" className="py-16 sm:py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10 sm:mb-16">
          <h2 id="curriculum-heading" className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Complete curriculum
          </h2>
          <p className="text-lg sm:text-xl text-slate-600">5 lectures building your ECS expertise</p>
        </div>

        <ol className="max-w-4xl mx-auto space-y-4 sm:space-y-6 list-none">
          {lectures.map((l) => (
            <li
              key={l.number}
              className="bg-white rounded-xl shadow-lg p-5 sm:p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                <div
                  className="bg-emerald-600 text-white rounded-full w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center font-bold flex-shrink-0"
                  aria-hidden="true"
                >
                  {l.number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-1 sm:mb-2">
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-900">
                      <span className="sr-only">Lecture {l.number}: </span>
                      {l.title}
                    </h3>
                    <span className="text-emerald-700 text-xs sm:text-sm font-semibold bg-emerald-50 px-2 py-1 rounded">
                      {l.duration}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm sm:text-base">{l.description}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
