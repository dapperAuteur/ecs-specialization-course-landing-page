import React from 'react'
import { Brain, Network, Dna, Activity } from 'lucide-react';

function CourseFeatures() {
  const features = [
      {
        icon: <Brain className="w-8 h-8 text-blue-600" />,
        title: "Your Hidden Body System",
        description: "Discover the endocannabinoid system - found in every human but taught in no medical schools"
      },
      {
        icon: <Dna className="w-8 h-8 text-green-600" />,
        title: "Natural Cannabis Chemicals",
        description: "Learn about anandamide ('bliss molecule') and 2-AG that your body makes every day"
      },
      {
        icon: <Network className="w-8 h-8 text-purple-600" />,
        title: "Backward Brain Signals",
        description: "Understand the only brain system that sends messages backward - crucial for learning"
      },
      {
        icon: <Activity className="w-8 h-8 text-orange-600" />,
        title: "Optimization Without Cannabis",
        description: "Activate your ECS naturally through fitness, nutrition, and neuroscience techniques"
      }
    ];
  return (
    <div className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">What You'll Master</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Based on 40+ years of research and the latest scientific evidence
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
  )
}

export default CourseFeatures