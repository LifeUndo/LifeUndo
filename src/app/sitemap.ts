import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://getlifeundo.com';
  return [
    { url: `${base}/ru`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/ru/pricing`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/ru/support`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/ru/use-cases`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/ru/fund/apply`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/ru/privacy`, changeFrequency: 'yearly', priority: 0.3 },
  ];
}





