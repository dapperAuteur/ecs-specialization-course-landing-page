'use client';

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { type ReactNode } from 'react';

/**
 * Wraps a subtree in the reCAPTCHA v3 provider. Reads the public site key
 * from process.env (NEXT_PUBLIC_*); when missing, renders children without
 * the provider so dev / preview environments don't 500.
 */
export default function RecaptchaProvider({ children }: { children: ReactNode }) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!siteKey) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[recaptcha] NEXT_PUBLIC_RECAPTCHA_SITE_KEY missing — rendering form without provider');
    }
    return <>{children}</>;
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={siteKey}
      scriptProps={{ async: true, defer: true, appendTo: 'body' }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
