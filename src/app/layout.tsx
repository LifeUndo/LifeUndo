import "./[locale]/globals.css";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://getlifeundo.com'),
  title: {
    default: 'GetLifeUndo — Ctrl+Z для вашей жизни в сети',
    template: '%s — GetLifeUndo',
  },
  description:
    'Возвращайте случайно удалённый текст и прошлые версии ввода. Локально, без телеметрии.',
  keywords: ['Ctrl+Z', 'отмена', 'восстановление', 'текст', 'формы', 'буфер обмена', 'локально', 'приватность'],
  authors: [{ name: 'GetLifeUndo Team' }],
  creator: 'GetLifeUndo',
  publisher: 'GetLifeUndo',
  alternates: { 
    canonical: '/',
    languages: {
      'ru-RU': 'https://getlifeundo.com/ru',
      'en-US': 'https://getlifeundo.com/en',
    }
  },
  openGraph: {
    type: 'website',
    url: 'https://getlifeundo.com/',
    title: 'GetLifeUndo — Ctrl+Z для вашей жизни в сети',
    description: 'Локальная история ввода и буфера. Без телеметрии.',
    siteName: 'GetLifeUndo',
    images: [
      {
        url: '/brand/getlifeundo-og.png',
        width: 1200,
        height: 630,
        alt: 'GetLifeUndo - Ctrl+Z для вашей жизни в сети',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GetLifeUndo — Ctrl+Z для вашей жизни в сети',
    description: 'Локальная история ввода и буфера. Без телеметрии.',
    images: ['/brand/getlifeundo-og.png'],
    creator: '@GetLifeUndo',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}
