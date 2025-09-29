import "./globals.css";
import ModernHeader from '@/components/ModernHeader';
import ModernFooter from '@/components/ModernFooter';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GetLifeUndo — Ctrl+Z для вашей жизни в сети',
  description: 'Сохраняйте состояния, откатывайте ошибки и возвращайте важные версии мгновенно. Расширение для Firefox с восстановлением вкладок.',
  keywords: 'GetLifeUndo, восстановление вкладок, Firefox, расширение, Ctrl+Z, откат',
  openGraph: {
    title: 'GetLifeUndo — Ctrl+Z для вашей жизни в сети',
    description: 'Сохраняйте состояния, откатывайте ошибки и возвращайте важные версии мгновенно.',
    type: 'website',
    url: 'https://getlifeundo.com',
    siteName: 'GetLifeUndo',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GetLifeUndo — Ctrl+Z для вашей жизни в сети',
    description: 'Сохраняйте состояния, откатывайте ошибки и возвращайте важные версии мгновенно.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://getlifeundo.com';
  
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
      </head>
      <body className="min-h-dvh bg-[#0B1220] text-white antialiased">
        <ModernHeader />
        <main className="min-h-dvh pt-20">{children}</main>
        <ModernFooter locale={locale} />
      </body>
    </html>
  );
}
