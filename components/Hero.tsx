import React from 'react'

function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500 rounded-full opacity-10 animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-500 rounded-full opacity-10 animate-pulse delay-300"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full opacity-5 animate-pulse delay-700"></div>
          </div>
          
          <div className="relative container mx-auto px-6 py-24">
            <div className="text-center text-white">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Master Your Body's
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Hidden Cannabis System
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto opacity-90">
                The most important discovery in modern medicine that 99% of people don't know about. 
                Learn the science-based system working in your body right now.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-6 py-3">
                  <span className="text-blue-300 font-semibold">✓ Science-Based</span>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-6 py-3">
                  <span className="text-purple-300 font-semibold">✓ 40+ Years Research</span>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-6 py-3">
                  <span className="text-indigo-300 font-semibold">✓ Complete Specialization</span>
                </div>
              </div>
            </div>
          </div>
        </div>
  )
}

export default Hero