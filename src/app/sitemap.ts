import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://getlifeundo.com';
  return [
    // Russian pages
    { url: `${base}/ru`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/ru/downloads`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/ru/features`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/ru/pricing`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/ru/use-cases`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/ru/support`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/ru/fund`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/ru/fund/apply`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/ru/contacts`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${base}/ru/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/ru/terms`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/ru/developers`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/ru/partners`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/ru/legal/offer`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/ru/legal/sla`, changeFrequency: 'yearly', priority: 0.3 },
    
    // English pages
    { url: `${base}/en`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/en/downloads`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/en/features`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/en/pricing`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/en/support`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/en/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/en/terms`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/en/developers`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/en/partners`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/en/legal/offer`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/en/legal/sla`, changeFrequency: 'yearly', priority: 0.3 },
  ];
}





