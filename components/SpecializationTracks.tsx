import React from 'react'
import { Brain, CheckCircle, Activity, Utensils } from 'lucide-react';

function SpecializationTracks() {
  const specializations = [
      {
        icon: <Utensils className="w-12 h-12 text-green-500" />,
        title: "Nutrition for ECS Optimization",
        description: "Foods that provide endocannabinoid building blocks and support CB2 receptor function",
        highlights: ["Omega-3 fatty acids", "Anti-inflammatory foods", "Micronutrient cofactors"]
      },
      {
        icon: <Activity className="w-12 h-12 text-blue-500" />,
        title: "Fitness for ECS Activation", 
        description: "Exercise protocols that boost anandamide and 2-AG levels naturally",
        highlights: ["Runner's high science", "HIIT for endocannabinoids", "Recovery optimization"]
      },
      {
        icon: <Brain className="w-12 h-12 text-purple-500" />,
        title: "Neuroscience Foundations",
        description: "Mindfulness and brain training to optimize retrograde signaling and plasticity",
        highlights: ["Meditation effects on ECS", "Stress reduction techniques", "Cognitive enhancement"]
      }
    ];
  
  return (
    <div className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Complete ECS Specialization Program
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Master how fitness, nutrition, and neuroscience work together within your endocannabinoid system
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {specializations.map((spec, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow border border-gray-100">
                  <div className="text-center mb-6">
                    {spec.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">{spec.title}</h3>
                  <p className="text-gray-600 mb-6 text-center">{spec.description}</p>
                  <ul className="space-y-3">
                    {spec.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
  )
}

export default SpecializationTracks