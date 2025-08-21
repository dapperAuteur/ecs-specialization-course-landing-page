import React from 'react'
import { Award, Clock, BookOpen, Target } from 'lucide-react';

function Stats() {
  const stats = [
    { number: "40+", label: "Years Research Experience", icon: <Award className="w-6 h-6" /> },
    { number: "12,272", label: "Published ECS Studies", icon: <BookOpen className="w-6 h-6" /> },
    { number: "500M", label: "Years of Evolution", icon: <Clock className="w-6 h-6" /> },
    { number: "3", label: "Specialized Tracks", icon: <Target className="w-6 h-6" /> }
  ];
  return (
    <div className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4 text-blue-600">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
  )
}

export default Stats