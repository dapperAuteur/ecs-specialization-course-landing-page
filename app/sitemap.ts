import type { MetadataRoute } from 'next';

const SITE_URL = 'https://ecs-specialization.betterbud.club';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/safety`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/age-gate`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
