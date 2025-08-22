"use client"

import React, { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { CheckCircle, ArrowRight, AlertTriangle, PlusCircle } from 'lucide-react';

/**
 * The main form component, which includes reCAPTCHA logic.
 * This component must be a child of GoogleReCaptchaProvider.
 */
const industryRolesOptions = [
  "Budtender",
  "Medical User",
  "Recreational User",
  "Industry Professional",
  "Naturopathic Doctor",
  "Medical Doctor",
];
const LeadForm = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    interest: ''
  });

  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setSelectedRoles(prev => 
      checked ? [...prev, value] : prev.filter(role => role !== value)
    );
  };

  const handleResetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      interest: ''
    });
    setSelectedRoles([]);
    setIsSubmitted(false);
    setSubmitMessage(null);
    setIsError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage(null);
    setIsError(false);

    // Guard clause if executeRecaptcha is not available
    if (!executeRecaptcha) {
      console.error("reCAPTCHA not initialized");
      setSubmitMessage("reCAPTCHA is not ready. Please try again in a moment.");
      setIsError(true);
      return;
    }

    // Basic client-side validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        setSubmitMessage("Please fill out all required fields.");
        setIsError(true);
        return;
    }

    setIsSubmitting(true);

    try {
      // Generate the reCAPTCHA token for the 'submit' action
      const token = await executeRecaptcha('submit');

      // Send form data and token to the backend API
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, industryRoles: selectedRoles, token }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'An unknown error occurred.');
      }
      
      // Handle success
      setIsSubmitted(true);

    } catch (error: any) {
      console.error("Submission failed:", error);
      setSubmitMessage(error.message);
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Render the success message UI
  if (isSubmitted) {
    return (
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
        <div className="mt-8">
            <button
                onClick={handleResetForm}
                className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold py-3 px-6 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 flex items-center justify-center space-x-2 text-base"
            >
                <PlusCircle className="w-5 h-5" />
                <span>Submit Another Response</span>
            </button>
        </div>
      </div>
    );
  }

  // Render the form UI
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Get Early Access to the ECS Specialization
        </h2>
        <p className="text-gray-600">
          Join the first group to master your body's hidden cannabis system
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              placeholder="Enter your first name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              placeholder="Enter your last name"
              required
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            placeholder="your.email@company.com"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            placeholder="(555) 123-4567"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            Which of the following best describe you? (Select all that apply)
          </label>
          <div className="grid grid-cols-2 gap-4">
            {industryRolesOptions.map((role) => (
              <label key={role} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  value={role}
                  onChange={handleRoleChange}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-800">{role}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Interest</label>
          <select
            name="interest"
            value={formData.interest}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          >
            <option value="">Select your main interest...</option>
            <option value="fitness">Fitness & ECS Activation</option>
            <option value="nutrition">Nutrition for ECS Optimization</option>
            <option value="neuroscience">Neuroscience & Mindfulness</option>
            <option value="complete">Complete Specialization Program</option>
            <option value="business">Team/Company Training</option>
          </select>
        </div>

        {isError && submitMessage && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-center">
                <AlertTriangle className="h-5 w-5 mr-3" />
                <span>{submitMessage}</span>
            </div>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Get Early Access'}
          {!isSubmitting && <ArrowRight className="w-5 h-5" />}
        </button>
        
        <p className="text-xs text-gray-500 text-center">
            This site is protected by reCAPTCHA and the Google
            <a href="https://policies.google.com/privacy" className="underline hover:text-blue-600"> Privacy Policy </a> and
            <a href="https://policies.google.com/terms" className="underline hover:text-blue-600"> Terms of Service </a> apply.
        </p>
      </form>
    </div>
  );
};

export default LeadForm;