import type { Metadata } from 'next';
import AccountClient from './AccountClient';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params?.locale === 'en' ? 'en' : 'ru';
  const base = 'https://getlifeundo.com';
  const url = `${base}/${locale}/account`;
  const title = locale === 'en' ? 'Account — GetLifeUndo' : 'Личный кабинет — GetLifeUndo';
  const description = locale === 'en'
    ? 'Manage your license and bonuses. View order details and get support.'
    : 'Управляйте лицензией и бонусами. Смотрите детали заказа и обращайтесь в поддержку.';
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'ru-RU': `${base}/ru/account`,
        'en-US': `${base}/en/account`,
        'x-default': `${base}/en/account`,
      },
    },
    openGraph: { url, title, description, images: [{ url: '/brand/getlifeundo-og.png', width: 1200, height: 630 }] },
    twitter: { title, description, images: ['/brand/getlifeundo-og.png'] },
  };
}

export default function AccountPage() {
  return <AccountClient />;
}


