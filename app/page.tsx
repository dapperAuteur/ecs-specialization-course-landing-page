import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import ProblemStatement from '@/components/ProblemStatement';
import CourseFeatures from '@/components/CourseFeatures';
import CourseCurriculum from '@/components/CourseCurriculum';
import SpecializationTracks from '@/components/SpecializationTracks';
import ScientificEvidence from '@/components/ScientificEvidence';
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

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <main id="main" className="flex-1">
        <Hero />
        <Stats />
        <ProblemStatement />
        <CourseFeatures />
        <CourseCurriculum />
        <SpecializationTracks />
        <ScientificEvidence />

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
