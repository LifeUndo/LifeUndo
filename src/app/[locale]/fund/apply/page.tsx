import type { Metadata } from 'next';
import ApplyClient from './ApplyClient';

export async function generateMetadata({ params }: { params: { locale: 'ru' | 'en' } }): Promise<Metadata> {
  const locale = params?.locale === 'en' ? 'en' : 'ru';
  const base = 'https://getlifeundo.com';
  const url = `${base}/${locale}/fund/apply`;
  const title = locale === 'en' ? 'Apply to the GetLifeUndo Fund' : 'Подать заявку в фонд GetLifeUndo';
  const description = locale === 'en'
    ? 'Submit your project for funding: education, research, social initiatives. Review time — 5 business days.'
    : 'Подайте заявку на финансирование: образование, исследования, социальные инициативы. Рассмотрение — 5 рабочих дней.';
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'ru-RU': `${base}/ru/fund/apply`,
        'en-US': `${base}/en/fund/apply`,
        'x-default': `${base}/en/fund/apply`,
      },
    },
    openGraph: { url, title, description, images: [{ url: '/brand/getlifeundo-og.png', width: 1200, height: 630 }] },
    twitter: { title, description, images: ['/brand/getlifeundo-og.png'] },
  };
}

export default function FundApplyPage({ params }: { params: { locale: 'ru' | 'en' } }) {
  return <ApplyClient locale={params.locale} />;
}