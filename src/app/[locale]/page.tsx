import React from 'react';
import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params?.locale === 'en' ? 'en' : 'ru';
  const base = 'https://getlifeundo.com';
  const url = `${base}/${locale}`;
  const title = locale === 'en' ? 'GetLifeUndo — Undo your browser fails' : 'GetLifeUndo — Верни потерянный текст и вкладки';
  const description = locale === 'en'
    ? 'Forms, tabs, clipboard — 100% local and private. Install, type, relax.'
    : 'Формы, вкладки, буфер — 100% локально и приватно. Установи и работай спокойно.';
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'ru-RU': `${base}/ru`,
        'en-US': `${base}/en`,
        'x-default': `${base}/en`,
      }
    },
    openGraph: { url, title, description, images: [{ url: '/brand/getlifeundo-og.png', width: 1200, height: 630 }] },
    twitter: { title, description, images: ['/brand/getlifeundo-og.png'] },
  };
}

export default function LocaleIndex() {
  return (
    <div className="min-h-screen">
      <HomeClient />
    </div>
  );
}