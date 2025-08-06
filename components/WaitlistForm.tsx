"use client"

import React, { useCallback, useState, useEffect } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import clientLogger from '../logging/clientLogger';

interface FormValues {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    interest: string;
}

interface FormErrors {
    [key: string]: string | undefined;
}

// Phone regex for client-side validation
const phoneRegex = /^\+?[1-9]\d{6,14}$/;
const emailRegex = /.+\@.+\..+/;

export default function WaitlistForm({ pageSource }: { pageSource: string }) {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [formData, setFormData] = useState<FormValues>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    interest: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [referrer, setReferrer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string>('');
  const [pageSourceState, setpageSourceState] = useState(pageSource);

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required.';
    if (!formData.lastName) newErrors.lastName = 'Last name is required.';
    if (!formData.email) {
        newErrors.email = 'Email is required.';
    } else if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address.';
    }
    // Phone number is optional, if phone validate.
    if (formData.phone.length > 0 && !phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number (e.g., +11234567890).';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      clientLogger.warn('Client-side validation failed', { errors: newErrors });
    }
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    console.log('referrer :>> ', referrer);
    e.preventDefault();
    setServerError('');
    if (!validate()) {
      return;
    }

    // NEW: Check if reCAPTCHA is ready
    if (!executeRecaptcha) {
      clientLogger.error("reCAPTCHA not available yet");
      setServerError("Verification service is not ready. Please try again in a moment.");
      return;
    }

    setIsSubmitting(true);
    clientLogger.info('Submitting waitlist form', { formData });

    // NEW: Get reCAPTCHA token
    const token = await executeRecaptcha('3pageEbook');

    try {
        const response = await fetch('/api/waitlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // NEW: Send token with the form data
            body: JSON.stringify({ ...formData, pageSourceState, referrer, token }),
        });
        console.log('pageSourceState :>> ', pageSourceState);

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'An unknown error occurred.');
        }

        clientLogger.info('Waitlist submission successful');

        // --- NEW: If successful, also send to Keap ---
        // This is a "fire-and-forget" call so it doesn't slow down the UI.
        // sendToKeap(formData);

        setIsSubmitted(true);
    } catch (error: any) {
        clientLogger.error('Waitlist submission failed', { error: error.message });
        setServerError(error.message as string);
    } finally {
        setIsSubmitting(false);
    }
  }, [executeRecaptcha, formData, referrer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetFormAndGoBack = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      interest: '',
    });
    setErrors({});
    setServerError('');
    setIsSubmitted(false);
  };

  useEffect(() => {
    setReferrer(document.referrer);
    setpageSourceState(pageSource);
    clientLogger.info('Landing page loaded', { referrer: document.referrer });
    console.log('referrer :>> ', referrer);
    console.log('pageSource :>> ', pageSource);
  }, [pageSource]);

}