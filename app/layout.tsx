import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const SITE_URL = 'https://ecs-specialization.betterbud.club';
const SITE_DESCRIPTION =
  'Master the science of the mammalian endocannabinoid system. Receptor biology, endogenous ligands, and signaling — distilled from 40+ years of research.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'ECS Specialization — Endocannabinoid System Training',
    template: '%s | ECS Specialization',
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
  // OG image generated dynamically at build by app/opengraph-image.tsx;
  // Next 16 picks it up automatically and includes it in metadata.
  openGraph: {
    type: 'website',
    siteName: 'ECS Specialization',
    title: 'ECS Specialization — Endocannabinoid System Training',
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ECS Specialization — Endocannabinoid System Training',
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:text-emerald-700 focus:px-4 focus:py-2 focus:rounded focus:outline-2 focus:outline-emerald-600"
        >
          Skip to main content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
