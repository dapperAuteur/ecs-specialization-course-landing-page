import React from 'react'

function ProblemStatement() {
  return (
    <div className="py-20 bg-gradient-to-r from-red-50 to-orange-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                The Hidden System Your Doctor Never Learned About
              </h2>
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <p className="text-xl text-gray-700 leading-relaxed mb-6">
                  Despite being one of the most important regulatory systems in your body, 
                  <strong className="text-red-600"> the endocannabinoid system isn't taught in most medical schools</strong>.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  This system controls stress, sleep, pain, immunity, learning, and memory. 
                  It's been working in your body every second since birth, yet most healthcare professionals know nothing about it.
                </p>
                <div className="bg-blue-50 rounded-lg p-6">
                  <p className="text-gray-800 font-semibold">
                    Recent research shows the ECS is "a widespread neuromodulatory network playing a major role in tuning cognitive and physiological processes" 
                    <span className="text-sm text-gray-600"> - PMC Review, 2024</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
  )
}

export default ProblemStatement