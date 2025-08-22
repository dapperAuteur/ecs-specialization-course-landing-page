// app/page.tsx

"use client"

import React, { useState } from 'react';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { CheckCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import ProblemStatement from '@/components/ProblemStatement';
import CourseFeatures from '@/components/CourseFeatures';
import CourseCurriculum from '@/components/CourseCurriculum';
import SpecializationTracks from '@/components/SpecializationTracks';
import ScientificEvidence from '@/components/ScientificEvidence';
import LeadForm from '@/components/LeadForm';

/**
 * The main form component, which includes reCAPTCHA logic.
 * This component must be a child of GoogleReCaptchaProvider.
 */
// const LeadForm = () => {
//   const { executeRecaptcha } = useGoogleReCaptcha();
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     interest: ''
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [submitMessage, setSubmitMessage] = useState<string | null>(null);
//   const [isError, setIsError] = useState(false);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSubmitMessage(null);
//     setIsError(false);

//     // Guard clause if executeRecaptcha is not available
//     if (!executeRecaptcha) {
//       console.error("reCAPTCHA not initialized");
//       setSubmitMessage("reCAPTCHA is not ready. Please try again in a moment.");
//       setIsError(true);
//       return;
//     }

//     // Basic client-side validation
//     if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
//         setSubmitMessage("Please fill out all required fields.");
//         setIsError(true);
//         return;
//     }

//     setIsSubmitting(true);

//     try {
//       // Generate the reCAPTCHA token for the 'submit' action
//       const token = await executeRecaptcha('submit');

//       // Send form data and token to the backend API
//       const response = await fetch('/api/leads', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ...formData, token }),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || 'An unknown error occurred.');
//       }
      
//       // Handle success
//       setIsSubmitted(true);

//     } catch (error: any) {
//       console.error("Submission failed:", error);
//       setSubmitMessage(error.message);
//       setIsError(true);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
  
//   // Render the success message UI
//   if (isSubmitted) {
//     return (
//       <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
//         <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//           <CheckCircle className="w-10 h-10 text-green-600" />
//         </div>
//         <h3 className="text-2xl font-bold text-gray-900 mb-4">Welcome to the ECS Specialization!</h3>
//         <p className="text-gray-600 mb-6">
//           You'll receive course details and early access information via email within 24 hours.
//         </p>
//         <div className="bg-blue-50 rounded-lg p-6">
//           <p className="text-blue-800 font-semibold">
//             Next steps: Check your email for your personalized learning pathway and science-based resources.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // Render the form UI
//   return (
//     <div className="bg-white rounded-2xl shadow-2xl p-8">
//       <div className="text-center mb-8">
//         <h2 className="text-3xl font-bold text-gray-900 mb-4">
//           Get Early Access to the ECS Specialization
//         </h2>
//         <p className="text-gray-600">
//           Join the first group to master your body's hidden cannabis system
//         </p>
//       </div>
      
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
//             <input
//               type="text"
//               name="firstName"
//               value={formData.firstName}
//               onChange={handleInputChange}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
//               placeholder="Enter your first name"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
//             <input
//               type="text"
//               name="lastName"
//               value={formData.lastName}
//               onChange={handleInputChange}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
//               placeholder="Enter your last name"
//               required
//             />
//           </div>
//         </div>
        
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleInputChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
//             placeholder="your.email@company.com"
//             required
//           />
//         </div>
        
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
//           <input
//             type="tel"
//             name="phone"
//             value={formData.phone}
//             onChange={handleInputChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
//             placeholder="(555) 123-4567"
//             required
//           />
//         </div>
        
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Interest</label>
//           <select
//             name="interest"
//             value={formData.interest}
//             onChange={handleInputChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
//           >
//             <option value="">Select your main interest...</option>
//             <option value="fitness">Fitness & ECS Activation</option>
//             <option value="nutrition">Nutrition for ECS Optimization</option>
//             <option value="neuroscience">Neuroscience & Mindfulness</option>
//             <option value="complete">Complete Specialization Program</option>
//             <option value="business">Team/Company Training</option>
//           </select>
//         </div>

//         {isError && submitMessage && (
//             <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-center">
//                 <AlertTriangle className="h-5 w-5 mr-3" />
//                 <span>{submitMessage}</span>
//             </div>
//         )}
        
//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {isSubmitting ? 'Submitting...' : 'Get Early Access'}
//           {!isSubmitting && <ArrowRight className="w-5 h-5" />}
//         </button>
        
//         <p className="text-xs text-gray-500 text-center">
//             This site is protected by reCAPTCHA and the Google
//             <a href="https://policies.google.com/privacy" className="underline hover:text-blue-600"> Privacy Policy </a> and
//             <a href="https://policies.google.com/terms" className="underline hover:text-blue-600"> Terms of Service </a> apply.
//         </p>
//       </form>
//     </div>
//   );
// };

/**
 * The main page component, wrapping the application with the reCAPTCHA provider.
 */
const ECSCourseLanding = () => {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!recaptchaSiteKey) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50">
        <div className="text-center p-8 bg-white shadow-lg rounded-lg">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-700">Configuration Error</h2>
          <p className="text-red-600 mt-2">The reCAPTCHA Site Key is not configured. Please check your environment variables.</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Hero />
        <Stats />
        <ProblemStatement />
        <CourseFeatures />
        <CourseCurriculum />
        <SpecializationTracks />
        <ScientificEvidence />

        {/* Lead Form Section */}
        <div className="py-20 bg-gradient-to-r from-blue-900 to-purple-900">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto">
              <LeadForm />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </GoogleReCaptchaProvider>
  );
};

export default ECSCourseLanding;