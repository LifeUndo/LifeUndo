
import React from 'react';
import type { Metadata } from 'next';
import DownloadsEnClient from './DownloadsEnClient';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params?.locale === 'en' ? 'en' : 'ru';
  const base = 'https://getlifeundo.com';
  const url = `${base}/${locale}/downloads`;
  const title = 'Downloads — GetLifeUndo';
  const description = 'Choose your platform and install GetLifeUndo to protect from data loss.';
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'ru-RU': `${base}/ru/downloads`,
        'en-US': `${base}/en/downloads`,
        'x-default': `${base}/en/downloads`,
      },
    },
    openGraph: { url, title, description, images: [{ url: '/brand/getlifeundo-og.png', width: 1200, height: 630 }] },
    twitter: { title, description, images: ['/brand/getlifeundo-og.png'] },
  };
}

export default function DownloadsClientEN() {
  return <DownloadsEnClient />;
}
