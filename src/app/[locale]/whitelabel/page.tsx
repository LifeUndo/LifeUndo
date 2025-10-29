import type { Metadata } from 'next';
import WhiteLabelClient from './WhiteLabelClient';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params?.locale === 'en' ? 'en' : 'ru';
  const base = 'https://getlifeundo.com';
  const url = `${base}/${locale}/whitelabel`;
  const title = locale === 'en' ? 'White‑label / OEM — GetLifeUndo' : 'White‑label / OEM — GetLifeUndo';
  const description = locale === 'en'
    ? 'Brand GetLifeUndo for your company. WL‑Starter/WL‑Pro/WL‑Enterprise. From 100 VIP subscriptions.'
    : 'Брендируйте GetLifeUndo под вашу компанию. Пакеты WL‑Starter/WL‑Pro/WL‑Enterprise. От 100 VIP‑подписок.';
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'ru-RU': `${base}/ru/whitelabel`,
        'en-US': `${base}/en/whitelabel`,
        'x-default': `${base}/en/whitelabel`,
      }
    },
    openGraph: { url, title, description, images: [{ url: '/brand/getlifeundo-og.png', width: 1200, height: 630 }] },
    twitter: { title, description, images: ['/brand/getlifeundo-og.png'] },
  };
}

export default function WhiteLabelPage({ params }: { params: { locale: string } }) {
  return <WhiteLabelClient locale={params.locale} />;
}
