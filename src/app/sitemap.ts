import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://getlifeundo.com';
  const locales = ['ru', 'en']; // Only RU and EN for now
  
  const pages = [
    { path: '', priority: 1.0, changeFrequency: 'daily' }, // home
    { path: '/about', priority: 0.4, changeFrequency: 'monthly' },
    { path: '/features', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/pricing', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/downloads', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/support', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/license', priority: 0.3, changeFrequency: 'yearly' },
  ];
  
  const sitemap: MetadataRoute.Sitemap = [];
  
  // Add all locales and pages
  locales.forEach(locale => {
    pages.forEach(page => {
      const url = page.path ? `${base}/${locale}${page.path}` : `${base}/${locale}`;
      sitemap.push({
        url,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency as any,
        priority: page.priority,
        alternates: {
          languages: {
            ru: `${base}/ru${page.path}`,
            en: `${base}/en${page.path}`,
          },
        },
      });
    });
  });
  
  return sitemap;
}





