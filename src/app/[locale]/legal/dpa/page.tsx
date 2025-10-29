import React from 'react';
import type { Metadata } from 'next';
import DPAClient from './DPAClient';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params?.locale === 'en' ? 'en' : 'ru';
  const base = 'https://getlifeundo.com';
  const url = `${base}/${locale}/legal/dpa`;
  const title = locale === 'en' ? 'Data Processing Agreement (DPA) — GetLifeUndo' : 'Соглашение об обработке ПДн (DPA) — GetLifeUndo';
  const description = locale === 'en'
    ? 'Terms of personal data processing between organizations and GetLifeUndo: principles, categories, security, rights.'
    : 'Условия обработки персональных данных между организациями и GetLifeUndo: принципы, категории, безопасность, права.';
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'ru-RU': `${base}/ru/legal/dpa`,
        'en-US': `${base}/en/legal/dpa`,
        'x-default': `${base}/en/legal/dpa`,
      }
    },
    openGraph: { url, title, description, images: [{ url: '/brand/getlifeundo-og.png', width: 1200, height: 630 }] },
    twitter: { title, description, images: ['/brand/getlifeundo-og.png'] },
  };
}

export default function DPAPage({ params }: { params: { locale: string } }): React.ReactElement {
  const locale = params?.locale === 'en' ? 'en' : 'ru';
  return <DPAClient />;
}
