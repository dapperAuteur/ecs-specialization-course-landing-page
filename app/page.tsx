"use client"

import React, { useState } from 'react';
import { Brain, Network, Heart, Dna, CheckCircle, Users, Award, Clock, ArrowRight, BookOpen, Activity, Utensils, Target } from 'lucide-react';

const ECSCourseLanding = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    interest: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    if (formData.firstName && formData.lastName && formData.email && formData.phone) {
      setIsSubmitted(true);
      console.log('Form submitted:', formData);
    }
  };

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

  const lectures = [
    {
      number: "01",
      title: "The Cannabis Mystery",
      description: "Why humans have cannabis receptors and the 1990s discovery that changed medicine",
      duration: "18 min"
    },
    {
      number: "02", 
      title: "Your Body's Hidden Network",
      description: "Where CB1 and CB2 receptors live and why cannabis affects memory, appetite, and pain",
      duration: "20 min"
    },
    {
      number: "03",
      title: "Nature's Messengers", 
      description: "Anandamide and 2-AG - your body's natural cannabis chemicals made on-demand",
      duration: "22 min"
    },
    {
      number: "04",
      title: "The Cleanup Crew",
      description: "FAAH and MAGL enzymes that control how long your natural cannabis signals last",
      duration: "21 min"
    },
    {
      number: "05",
      title: "The Communication System",
      description: "Retrograde signaling - the revolutionary backward brain communication discovery",
      duration: "23 min"
    }
  ];

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

  const stats = [
    { number: "40+", label: "Years Research Experience", icon: <Award className="w-6 h-6" /> },
    { number: "12,272", label: "Published ECS Studies", icon: <BookOpen className="w-6 h-6" /> },
    { number: "500M", label: "Years of Evolution", icon: <Clock className="w-6 h-6" /> },
    { number: "3", label: "Specialized Tracks", icon: <Target className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
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

      {/* Stats Section */}
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

      {/* Problem Statement */}
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

      {/* Course Features */}
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

      {/* Course Curriculum */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Complete Curriculum</h2>
            <p className="text-xl text-gray-600">5 comprehensive lectures building your ECS expertise</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {lectures.map((lecture, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 mb-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">
                      {lecture.number}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{lecture.title}</h3>
                      <p className="text-gray-600">{lecture.description}</p>
                    </div>
                  </div>
                  <div className="text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-lg">
                    {lecture.duration}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Specialization Tracks */}
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

      {/* Scientific Evidence */}
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

      {/* Lead Form */}
      <div className="py-20 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            {!isSubmitted ? (
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Get Early Access to the ECS Specialization
                  </h2>
                  <p className="text-gray-600">
                    Join the first group to master your body's hidden cannabis system
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your.email@company.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Interest</label>
                    <select
                      name="interest"
                      value={formData.interest}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select your main interest...</option>
                      <option value="fitness">Fitness & ECS Activation</option>
                      <option value="nutrition">Nutrition for ECS Optimization</option>
                      <option value="neuroscience">Neuroscience & Mindfulness</option>
                      <option value="complete">Complete Specialization Program</option>
                      <option value="business">Team/Company Training</option>
                    </select>
                  </div>
                  
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2 text-lg"
                  >
                    <span>Get Early Access</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  
                  <p className="text-sm text-gray-500 text-center">
                    Join 1000+ professionals mastering the science of the endocannabinoid system
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Welcome to the ECS Specialization!</h3>
                <p className="text-gray-600 mb-6">
                  You'll receive course details and early access information via email within 24 hours.
                </p>
                <div className="bg-blue-50 rounded-lg p-6">
                  <p className="text-blue-800 font-semibold">
                    Next steps: Check your email for your personalized learning pathway and science-based resources.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-4">Master Your Body's Hidden System</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            40+ years of research, cutting-edge science, and practical applications 
            for optimizing your endocannabinoid system naturally.
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-400">
            <span>Science-Based Education</span>
            <span>•</span>
            <span>Evidence-Backed Methods</span>
            <span>•</span>
            <span>Professional Certification</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ECSCourseLanding;