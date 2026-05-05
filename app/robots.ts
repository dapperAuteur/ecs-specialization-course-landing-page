import type { MetadataRoute } from 'next';

const SITE_URL = 'https://ecs-specialization.betterbud.club';

export default function robots(): MetadataRoute.Robots {
  // Disallow indexing on Vercel preview deploys; allow on production.
  const isProduction =
    process.env.VERCEL_ENV === 'production' || !process.env.VERCEL_ENV;

  if (!isProduction) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/safety', '/age-gate'],
        disallow: ['/ebook/', '/age-gate/under-21', '/thanks', '/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
