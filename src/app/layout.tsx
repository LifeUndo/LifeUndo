import "./[locale]/globals.css";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://getlifeundo.com'),
  title: {
    default: 'GetLifeUndo — Ctrl+Z для браузера: восстановление текста, вкладок и буфера',
    template: '%s — GetLifeUndo',
  },
  description:
    'Восстановление текста форм, закрытых вкладок и истории буфера. 100% локально, без облака. Расширение для Firefox/Chrome. RU/EN.',
  keywords: [
    'восстановление текста',
    'откат действий',
    'закрытые вкладки',
    'история буфера',
    'браузерное расширение',
    'Firefox',
    'Chrome',
    'Ctrl+Z',
    'приватность',
    'локально',
    'restore form text',
    'reopen closed tabs',
    'clipboard history',
  ],
  authors: [{ name: 'GetLifeUndo Team' }],
  creator: 'GetLifeUndo',
  publisher: 'GetLifeUndo',
  alternates: { 
    canonical: 'https://getlifeundo.com/ru',
    languages: {
      'ru-RU': 'https://getlifeundo.com/ru',
      'en-US': 'https://getlifeundo.com/en',
    }
  },
  openGraph: {
    type: 'website',
    title: 'GetLifeUndo — Ctrl+Z для браузера',
    description: 'Restore form text, closed tabs, clipboard — 100% local.',
    url: 'https://getlifeundo.com/ru',
    siteName: 'GetLifeUndo',
    images: [
      {
        url: '/brand/getlifeundo-og.png',
        width: 1200,
        height: 630,
        alt: 'GetLifeUndo - Восстановление данных и отмена действий в браузере',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GetLifeUndo — Ctrl+Z for your browser',
    description: 'Restore form text, tabs and clipboard — 100% local, private.',
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
      <head>
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "GetLifeUndo",
            "url": "https://getlifeundo.com",
            "sameAs": [
              "https://t.me/GetLifeUndoSupport",
              "https://x.com/GetLifeUndo",
              "https://www.reddit.com/r/GetLifeUndo",
              "https://www.youtube.com/@GetLifeUndo",
              "https://github.com/GetLifeUndo",
              "https://vc.ru/id5309084",
              "https://habr.com/ru/users/GetLifeUndo25/"
            ]
          })}} />
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "GetLifeUndo",
            "applicationCategory": "BrowserExtension",
            "operatingSystem": "Windows, macOS, Linux",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "RUB" },
            "url": "https://getlifeundo.com/ru",
            "softwareVersion": "0.3.7.32",
            "description": "Restore form text, closed tabs and clipboard history. 100% local, private."
          })}} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
