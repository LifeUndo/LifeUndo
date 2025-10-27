import type { Metadata } from 'next';
import SupportClient from './SupportClient';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params?.locale === 'en' ? 'en' : 'ru';
  const base = 'https://getlifeundo.com';
  const url = `${base}/${locale}/support`;
  const title = locale === 'en' ? 'Support — GetLifeUndo' : 'Поддержка — GetLifeUndo';
  const description = locale === 'en'
    ? 'GetLifeUndo Support: answers to common questions and contact form.'
    : 'Поддержка GetLifeUndo: ответы на частые вопросы и форма связи.';
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'ru-RU': `${base}/ru/support`,
        'en-US': `${base}/en/support`,
      }
    },
    openGraph: { url, title, description },
    twitter: { title, description },
  };
}
export default function SupportPage() {
  return <SupportClient />;
}
