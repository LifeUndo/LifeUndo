import type { Metadata } from 'next';
import ApiDocsClient from './ApiDocsClient';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params?.locale === 'en' ? 'en' : 'ru';
  const base = 'https://getlifeundo.com';
  const url = `${base}/${locale}/api-docs`;
  const title = locale === 'en' ? 'API Docs — GetLifeUndo' : 'API Документация — GetLifeUndo';
  const description = locale === 'en'
    ? 'Interactive API documentation (Swagger UI) for GetLifeUndo.'
    : 'Интерактивная документация API (Swagger UI) для GetLifeUndo.';
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'ru-RU': `${base}/ru/api-docs`,
        'en-US': `${base}/en/api-docs`,
        'x-default': `${base}/en/api-docs`,
      },
    },
    openGraph: { url, title, description, images: [{ url: '/brand/getlifeundo-og.png', width: 1200, height: 630 }] },
    twitter: { title, description, images: ['/brand/getlifeundo-og.png'] },
  };
}

export default function ApiDocsPage() {
  return <ApiDocsClient />;
}
