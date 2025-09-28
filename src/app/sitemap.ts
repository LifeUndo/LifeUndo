import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://getlifeundo.com';
  const pages = ['', '/partners', '/developers', '/status'];
  const now = new Date().toISOString();
  return pages.map((p) => ({ url: base + p, lastModified: now }));
}



