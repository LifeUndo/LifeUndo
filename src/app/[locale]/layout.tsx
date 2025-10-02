// src/app/[locale]/layout.tsx
import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import '../globals.css';
import ModernHeader from '@/components/ModernHeader';
import ModernFooter from '@/components/ModernFooter';
import { Analytics } from '@/components/Analytics';

// импортируем только нужные неймспейсы
import ru_common from '../../../messages/ru/common.json';
import ru_downloads from '../../../messages/ru/downloads.json';
import en_common from '../../../messages/en/common.json';
import en_downloads from '../../../messages/en/downloads.json';

export const dynamic = 'force-static'; // безопасно для layout

type Props = {
  children: ReactNode;
  params: { locale: 'ru' | 'en' | string };
};

const BUNDLE: Record<string, Record<string, unknown>> = {
  ru: { common: ru_common, downloads: ru_downloads },
  en: { common: en_common, downloads: en_downloads },
};

export default function LocaleLayout({ children, params: { locale } }: Props) {
  const lang = (locale === 'en' || locale === 'ru') ? locale : 'ru';
  const messages = BUNDLE[lang] ?? BUNDLE.ru;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://getlifeundo.com';

  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={`${baseUrl}/${lang}`} />
        
        {/* Hreflang */}
        <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/`} />
        <link rel="alternate" hrefLang="ru-RU" href={`${baseUrl}/ru`} />
        <link rel="alternate" hrefLang="en" href={`${baseUrl}/en`} />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "GetLifeUndo",
            "url": "https://getlifeundo.com",
            "logo": "https://getlifeundo.com/brand/getlifeundo-round.png",
            "sameAs": [
              "https://t.me/LifeUndoSupport",
              "https://x.com/GetLifeUndo",
              "https://www.youtube.com/@GetLifeUndo",
              "https://github.com/LifeUndo"
            ]
          })
        }} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "GetLifeUndo",
            "applicationCategory": "Productivity",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "RUB"
            },
            "url": "https://getlifeundo.com"
          })
        }} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Что такое GetLifeUndo?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Расширение и сервис для «отката» действий в сети: вкладки, формы, правки, файлы и письма."
                }
              },
              {
                "@type": "Question",
                "name": "Это безопасно?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Мы не записываем парольные поля и не делимся данными с третьими лицами."
                }
              }
            ]
          })
        }} />
      </head>
      <body className="min-h-dvh bg-[#0B1220] text-white antialiased">
        <NextIntlClientProvider messages={messages} locale={lang}>
          <Analytics />
          <ModernHeader />
          <main className="min-h-dvh pt-20">{children}</main>
          <ModernFooter locale={lang} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
