import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import ProblemStatement from '@/components/ProblemStatement';
import CourseFeatures from '@/components/CourseFeatures';
import CourseCurriculum from '@/components/CourseCurriculum';
import SpecializationTracks from '@/components/SpecializationTracks';
import ScientificEvidence from '@/components/ScientificEvidence';
import FAQ from '@/components/FAQ';
import LeadForm from '@/components/LeadForm';
import RecaptchaProvider from '@/components/RecaptchaProvider';
import Footer from '@/components/Footer';

const courseJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'ECS Specialization',
  description:
    'A receptor-biology-focused specialization on the mammalian endocannabinoid system. Receptors (CB1, CB2), endogenous ligands (anandamide, 2-AG), degradation enzymes (FAAH, MAGL), and retrograde signaling.',
  educationalLevel: 'adult',
  inLanguage: 'en',
  audience: {
    '@type': 'Audience',
    audienceType: 'Adults 21+',
  },
  provider: {
    '@type': 'Organization',
    name: 'B4C LLC',
    url: 'https://ecs-specialization.betterbud.club',
  },
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'online',
    startDate: '2026-05-11',
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the endocannabinoid system?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A signaling system in every mammal. It uses two receptors (CB1, CB2), two ligands the body makes on demand (anandamide, 2-AG), and enzymes that break those ligands down (FAAH, MAGL). It tunes mood, sleep, appetite, immunity, learning, and pain.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this a class about cannabis?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. The course covers mammalian receptor biology, ligand chemistry, and signaling. The cannabis name is historical: researchers first noticed the receptors when studying compounds in the plant, but the system is the body’s own.',
      },
    },
    {
      '@type': 'Question',
      name: 'Who is the class for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Clinicians, naturopaths, fitness and wellness practitioners, students, and adults who want a serious foundation in their own physiology. No medical degree required.',
      },
    },
    {
      '@type': 'Question',
      name: 'When does the class start?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The first cohort opens for sign-ups in May 2026. Subscribers on this site are notified when enrollment opens.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long is the course?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Five core lectures of 18 to 23 minutes each, plus three specialization tracks (Fitness, Nutrition, Neuroscience) at the student’s own pace.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need a science background?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. The lectures introduce vocabulary and pathways from the ground up.',
      },
    },
    {
      '@type': 'Question',
      name: 'What will I be able to do after the class?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Read research papers on the endocannabinoid system without getting lost in the jargon, evaluate claims you see in popular media, and apply lifestyle protocols (sleep, exercise, nutrition, mindfulness) that have measurable effects on ECS tone.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this medical advice?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Everything on this site and in the course is educational. Always consult a licensed clinician for medical questions.',
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <main id="main" className="flex-1">
        <Hero />
        <Stats />
        <ProblemStatement />
        <CourseFeatures />
        <CourseCurriculum />
        <SpecializationTracks />
        <ScientificEvidence />
        <FAQ />

        <section
          id="lead-form"
          aria-labelledby="lead-form-heading"
          className="py-16 sm:py-20 bg-gradient-to-r from-emerald-900 to-teal-900"
        >
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <h2
                  id="lead-form-heading"
                  className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 sm:mb-3"
                >
                  Get the free preview ebook
                </h2>
                <p className="text-slate-600 text-sm sm:text-base">
                  Receptor biology, endogenous ligands, and signaling — distilled. 21+ only.
                </p>
              </div>
              <RecaptchaProvider>
                <LeadForm />
              </RecaptchaProvider>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
