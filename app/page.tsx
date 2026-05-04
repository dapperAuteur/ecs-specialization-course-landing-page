import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import ProblemStatement from '@/components/ProblemStatement';
import CourseFeatures from '@/components/CourseFeatures';
import CourseCurriculum from '@/components/CourseCurriculum';
import SpecializationTracks from '@/components/SpecializationTracks';
import ScientificEvidence from '@/components/ScientificEvidence';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <main id="main" className="flex-1">
        <Hero />
        <Stats />
        <ProblemStatement />
        <CourseFeatures />
        <CourseCurriculum />
        <SpecializationTracks />
        <ScientificEvidence />
        {/* Lead form section lands in Phase 5 with id="lead-form" */}
        <section
          id="lead-form"
          aria-labelledby="lead-form-heading"
          className="py-16 sm:py-20 bg-gradient-to-r from-emerald-900 to-teal-900"
        >
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-center">
              <h2 id="lead-form-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">
                Get the free preview ebook
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Form lands in the next phase of this build.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
