import { ChevronDown } from 'lucide-react';

/**
 * FAQ section. Native <details>/<summary> for keyboard + screen-reader
 * accessibility without JS. Per BAM lock 2026-05-04: no refund or pricing
 * questions until the paid checkout flow exists.
 */

interface QA {
  q: string;
  a: React.ReactNode;
}

const FAQS: QA[] = [
  {
    q: 'What is the endocannabinoid system?',
    a: (
      <>
        It is a signaling system in every mammal. It uses two receptors (CB1, CB2), two main
        ligands the body makes on demand (anandamide, 2-AG), and a pair of enzymes that break
        those ligands down (FAAH, MAGL). The system tunes mood, sleep, appetite, immune
        response, learning, and pain.
      </>
    ),
  },
  {
    q: 'Is this a class about cannabis?',
    a: (
      <>
        No. This is a class about the human body. Cannabis got its name because researchers
        first noticed receptors in the body when studying compounds in the plant, but the
        system is mammalian biology. The course teaches receptor biology, ligand chemistry, and
        signaling, not plant pharmacology.
      </>
    ),
  },
  {
    q: 'Who is the class for?',
    a: (
      <>
        Clinicians, naturopaths, fitness and wellness practitioners, students, and adults who
        want a serious foundation in how their own physiology works. No medical degree required;
        a willingness to engage with biology is enough.
      </>
    ),
  },
  {
    q: 'When does the class start?',
    a: (
      <>
        The first cohort opens for sign-ups in May 2026. Submit the form on this page and we
        will email you when enrollment opens.
      </>
    ),
  },
  {
    q: 'How long is it?',
    a: (
      <>
        The core curriculum is five lectures, roughly 18 to 23 minutes each. The specialization
        adds three tracks (Fitness, Nutrition, Neuroscience) that students can work through at
        their own pace.
      </>
    ),
  },
  {
    q: 'Do I need a science background?',
    a: (
      <>
        No. The lectures introduce vocabulary and pathways from the ground up. If you can read a
        Wikipedia article on a biology topic and follow it, you can follow this course.
      </>
    ),
  },
  {
    q: 'What will I be able to do after the class?',
    a: (
      <>
        You will be able to read research papers about the endocannabinoid system without
        getting lost in the jargon, evaluate claims you see in popular media, and apply lifestyle
        protocols (sleep, exercise, nutrition, mindfulness) that have measurable effects on ECS
        tone.
      </>
    ),
  },
  {
    q: 'Is this medical advice?',
    a: (
      <>
        No. Everything on this site and in the course is educational. Always consult a licensed
        clinician for medical questions.
      </>
    ),
  },
];

export default function FAQ() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="py-16 sm:py-20 bg-white scroll-mt-16"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <header className="text-center mb-8 sm:mb-12">
            <h2
              id="faq-heading"
              className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 sm:mb-4"
            >
              Frequently asked questions
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              Short answers to what people ask most.
            </p>
          </header>

          <ul className="space-y-3 sm:space-y-4">
            {FAQS.map(({ q, a }) => (
              <li key={q}>
                <details className="group bg-slate-50 hover:bg-slate-100 transition-colors rounded-xl border border-slate-200 open:bg-white open:shadow-sm">
                  <summary className="cursor-pointer list-none flex items-start justify-between gap-3 px-5 py-4 min-h-11 text-left text-base sm:text-lg font-semibold text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 rounded-xl">
                    <span>{q}</span>
                    <ChevronDown
                      className="w-5 h-5 mt-0.5 flex-shrink-0 text-emerald-700 transition-transform group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <div className="px-5 pb-5 pt-1 text-sm sm:text-base text-slate-700 leading-relaxed">
                    {a}
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
