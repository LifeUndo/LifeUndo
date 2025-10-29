import type { Metadata } from 'next';
import ApiClient from './ApiClient';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params?.locale === 'en' ? 'en' : 'ru';
  const base = 'https://getlifeundo.com';
  const url = `${base}/${locale}/api`;
  const title = locale === 'en' ? 'API — GetLifeUndo' : 'API — GetLifeUndo';
  const description = locale === 'en'
    ? 'API overview, endpoints, authentication and examples for GetLifeUndo.'
    : 'Обзор API, эндпоинты, аутентификация и примеры для GetLifeUndo.';
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'ru-RU': `${base}/ru/api`,
        'en-US': `${base}/en/api`,
        'x-default': `${base}/en/api`,
      },
    },
    openGraph: { url, title, description, images: [{ url: '/brand/getlifeundo-og.png', width: 1200, height: 630 }] },
    twitter: { title, description, images: ['/brand/getlifeundo-og.png'] },
  };
}

export default function ApiPage() {
  return <ApiClient />;
}
