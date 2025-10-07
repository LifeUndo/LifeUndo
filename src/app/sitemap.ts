import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://getlifeundo.com';
  const locales = ['ru', 'en', 'hi', 'zh', 'ar', 'kk', 'tr'];
  
  const pages = [
    '', // home
    'downloads',
    'pricing',
    'use-cases',
    'support',
    'fund',
    'contacts',
    'privacy',
    'license',
    'whitelabel',
    'creator/apply',
    'creator/partner'
  ];
  
  const sitemap: MetadataRoute.Sitemap = [];
  
  // Add all locales and pages
  locales.forEach(locale => {
    pages.forEach(page => {
      const url = page ? `${base}/${locale}/${page}` : `${base}/${locale}`;
      const priority = page === '' ? 1 : (page === 'downloads' || page === 'pricing' ? 0.9 : 0.7);
      sitemap.push({
        url,
        changeFrequency: 'weekly',
        priority
      });
    });
  });
  
  return sitemap;
}





