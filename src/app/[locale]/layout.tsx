import {NextIntlClientProvider} from 'next-intl';
import {unstable_setRequestLocale} from 'next-intl/server';
import {getMessagesFor} from '@/lib/messages';
import '../globals.css';
import ModernHeader from '@/components/ModernHeader';
import ModernFooter from '@/components/ModernFooter';
import { Analytics } from '@/components/Analytics';

export const dynamic = 'force-dynamic';

export default async function LocaleLayout({
  children, params: {locale},
}: {
  children: React.ReactNode, params: {locale: string}
}) {
  unstable_setRequestLocale(locale);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://getlifeundo.com';

  try {
    const messages = getMessagesFor(locale, ['common','downloads']);
    return (
      <html lang={locale}>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
          
          {/* Canonical URL */}
          <link rel="canonical" href={`${baseUrl}/${locale}`} />
          
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
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Analytics />
            <ModernHeader />
            <main className="min-h-dvh pt-20">{children}</main>
            <ModernFooter locale={locale} />
          </NextIntlClientProvider>
        </body>
      </html>
    );
  } catch (e) {
    console.error('[layout-i18n-fallback]', (e as Error).message);
    return (
      <html lang={locale}>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
          
          {/* Canonical URL */}
          <link rel="canonical" href={`${baseUrl}/${locale}`} />
          
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
          <Analytics />
          <ModernHeader />
          <main className="min-h-dvh pt-20">{children}</main>
          <ModernFooter locale={locale} />
        </body>
      </html>
    );
  }
}
