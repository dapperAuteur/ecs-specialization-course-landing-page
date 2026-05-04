import { Award, Clock, BookOpen, Target } from 'lucide-react';

const stats = [
  { number: '40+', label: 'Years of Research', Icon: Award },
  { number: '12,272', label: 'Published ECS Studies', Icon: BookOpen },
  { number: '500M', label: 'Years of Evolution', Icon: Clock },
  { number: '3', label: 'Specialization Tracks', Icon: Target },
];

export default function Stats() {
  return (
    <section aria-labelledby="stats-heading" className="py-16 bg-white">
      <h2 id="stats-heading" className="sr-only">
        Endocannabinoid System research at a glance
      </h2>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {stats.map(({ number, label, Icon }) => (
            <div key={label} className="text-center">
              <div className="flex justify-center mb-3 text-emerald-600">
                <Icon className="w-6 h-6" aria-hidden="true" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">{number}</div>
              <div className="text-slate-600 text-xs sm:text-sm">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
