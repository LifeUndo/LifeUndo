import type { Metadata } from 'next';
import ContractClient from './ContractClient';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params?.locale === 'en' ? 'en' : 'ru';
  const base = 'https://getlifeundo.com';
  const url = `${base}/${locale}/legal/contract`;
  const title = locale === 'en' ? 'Software Licensing Agreement (B2B) — GetLifeUndo' : 'Договор лицензирования ПО (B2B) — GetLifeUndo';
  const description = locale === 'en'
    ? 'B2B licensing agreement terms: license scope, payment, support, liability. Templates for 100+ VIP.'
    : 'Условия B2B‑лицензии: объём прав, оплата, поддержка, ответственность. Шаблоны для 100+ VIP.';
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'ru-RU': `${base}/ru/legal/contract`,
        'en-US': `${base}/en/legal/contract`,
      }
    },
    openGraph: { url, title, description },
    twitter: { title, description },
  };
}

export default function ContractPage({ params }: { params: { locale: string } }) {
  const locale = params?.locale === 'en' ? 'en' : 'ru';
  return <ContractClient locale={locale} />;
}
