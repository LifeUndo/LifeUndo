import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://getlifeundo.com';
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/ru/',
          '/en/',
          '/ru/about',
          '/en/about',
          '/ru/features',
          '/en/features',
          '/ru/pricing',
          '/en/pricing',
          '/ru/downloads',
          '/en/downloads',
          '/ru/support',
          '/en/support',
          '/ru/contact',
          '/en/contact',
          '/ru/license',
          '/en/license',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/private/',
          '/test/',
          '/debug/',
        ],
      },
    ],
    sitemap: [`${base}/sitemap.xml`],
    host: base.replace(/^https?:\/\//,''),
  };
}





