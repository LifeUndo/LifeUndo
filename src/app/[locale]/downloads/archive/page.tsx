import type { Metadata } from 'next';
import ArchiveClient from './ArchiveClient';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params?.locale === 'en' ? 'en' : 'ru';
  const base = 'https://getlifeundo.com';
  const url = `${base}/${locale}/downloads/archive`;
  const title = locale === 'en' ? 'Downloads — Version archive' : 'Загрузки — Архив версий';
  const description = locale === 'en'
    ? 'Download previous versions of GetLifeUndo for compatibility or testing.'
    : 'Скачайте предыдущие версии GetLifeUndo для совместимости или тестирования.';
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'ru-RU': `${base}/ru/downloads/archive`,
        'en-US': `${base}/en/downloads/archive`,
        'x-default': `${base}/en/downloads/archive`,
      }
    },
    openGraph: { url, title, description, images: [{ url: '/brand/getlifeundo-og.png', width: 1200, height: 630 }] },
    twitter: { title, description, images: ['/brand/getlifeundo-og.png'] },
  };
}

export default function ArchivePage({ params }: { params: { locale: string } }) {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-20">
        <ArchiveClient locale={params.locale || 'ru'} />
      </div>
    </div>
  );
}
