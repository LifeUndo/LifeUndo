import "./globals.css";
import ModernHeader from '@/components/ModernHeader';
import ModernFooter from '@/components/ModernFooter';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LifeUndo — Ctrl+Z для вашей жизни в сети',
  description: 'Сохраняйте состояния, откатывайте ошибки и возвращайте важные версии мгновенно. Расширение для Firefox с восстановлением вкладок.',
  keywords: 'LifeUndo, восстановление вкладок, Firefox, расширение, Ctrl+Z, откат',
  openGraph: {
    title: 'LifeUndo — Ctrl+Z для вашей жизни в сети',
    description: 'Сохраняйте состояния, откатывайте ошибки и возвращайте важные версии мгновенно.',
    type: 'website',
    url: 'https://lifeundo.ru',
    siteName: 'LifeUndo',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LifeUndo — Ctrl+Z для вашей жизни в сети',
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
  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-dvh bg-[#0B1220] text-white antialiased">
        <ModernHeader />
        <main className="min-h-dvh">{children}</main>
        <ModernFooter />
      </body>
    </html>
  );
}
