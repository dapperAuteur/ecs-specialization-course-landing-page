import { Heart, MapPin, Phone, ExternalLink } from 'lucide-react';

/**
 * Mirrors the centenarian-os RiseWellnessCard pattern (which is the
 * ecosystem-canonical convention for surfacing third-party mental-health
 * support resources). Colors swapped from sky to emerald to fit the ECS
 * palette; structure + content otherwise identical so the same operator
 * info travels with users across WitUS-ecosystem properties.
 */
export default function RiseWellnessCard() {
  return (
    <section
      id="rise-wellness"
      aria-label="Mental health support resources"
      className="bg-white border-l-4 border-emerald-200 rounded-xl p-5 shadow-sm scroll-mt-24"
    >
      <div className="flex items-center gap-2 mb-2">
        <Heart className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-emerald-700">Mental Health Support</h2>
      </div>
      <p className="text-sm text-slate-700 mb-4 leading-relaxed">
        Rise Wellness of Indiana provides compassionate, personalized, holistic mental health
        care, helping you heal, grow, and thrive in mind, body, and spirit.
      </p>
      <address className="not-italic space-y-2">
        <div className="flex items-start gap-2 text-sm text-slate-600">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
          <span>320 N Meridian St, Indianapolis, IN 46204</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Phone className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
          <a
            href="tel:+13179650299"
            aria-label="Call Rise Wellness of Indiana"
            className="text-emerald-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 rounded"
          >
            317-965-0299
          </a>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
          <a
            href="https://risewellnessofindiana.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 rounded"
          >
            risewellnessofindiana.com
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </address>
    </section>
  );
}
