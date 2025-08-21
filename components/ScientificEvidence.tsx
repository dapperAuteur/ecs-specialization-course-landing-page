import React from 'react'
import { CheckCircle } from 'lucide-react';

function ScientificEvidence() {
  return (
    <div className="py-20 bg-blue-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                Backed by Cutting-Edge Science
              </h2>
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">Recent Research Confirms:</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">ECS regulates mood disorders, anxiety, and depression (PMC, 2023)</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">Controls food intake and metabolic function (Nature, 2024)</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">Crucial for synaptic plasticity and learning (Int J Mol Sci, 2024)</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">Individual genetic variations affect sensitivity (Current research)</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">Why This Matters:</h3>
                    <div className="bg-blue-50 rounded-lg p-6">
                      <p className="text-gray-700 mb-4">
                        "Over 12,000 scientific papers published on endocannabinoids since 2000, 
                        yet most people know nothing about this critical system."
                      </p>
                      <p className="text-gray-700 font-semibold">
                        You'll gain knowledge that most healthcare professionals lack.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  )
}

export default ScientificEvidence