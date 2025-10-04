import "./[locale]/globals.css";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://getlifeundo.com'),
  title: {
    default: 'GetLifeUndo — Восстановление данных и отмена действий в браузере | Ctrl+Z для интернета',
    template: '%s — GetLifeUndo | Восстановление данных в браузере',
  },
  description:
    'Восстанавливайте случайно удаленные данные, закрытые вкладки и заполненные формы в браузере. Браузерное расширение для Firefox и Chrome. Локально, без телеметрии, приватно.',
  keywords: [
    // Основные ключевые слова
    'восстановление данных', 'восстановление файлов', 'отмена действий', 'браузерное расширение',
    'восстановление вкладок', 'история браузера', 'Ctrl+Z', 'откат изменений',
    
    // Специфичные для браузеров
    'Firefox расширение', 'Chrome расширение', 'браузерное расширение восстановление',
    'расширение для восстановления данных', 'браузерное расширение отмена',
    
    // Длинные хвосты
    'как восстановить случайно закрытую вкладку', 'восстановление заполненной формы',
    'восстановление случайно удаленных данных', 'локальное восстановление данных',
    'приватное восстановление файлов', 'восстановление без интернета',
    
    // Технические термины
    'локально', 'приватность', 'без телеметрии', 'история ввода', 'буфер обмена',
    'восстановление текста', 'отмена в браузере', 'браузерная история'
  ],
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
    title: 'GetLifeUndo — Восстановление данных и отмена действий в браузере',
    description: 'Восстанавливайте случайно удаленные данные, закрытые вкладки и заполненные формы в браузере. Браузерное расширение для Firefox и Chrome. Локально, без телеметрии.',
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
    title: 'GetLifeUndo — Восстановление данных в браузере',
    description: 'Восстанавливайте случайно удаленные данные, закрытые вкладки и заполненные формы. Браузерное расширение для Firefox и Chrome.',
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
            "@type": "SoftwareApplication",
            "name": "GetLifeUndo",
            "description": "Браузерное расширение для восстановления данных и отмены действий в браузере. Восстанавливает случайно удаленные данные, закрытые вкладки и заполненные формы локально без телеметрии.",
            "url": "https://getlifeundo.com",
            "logo": "https://getlifeundo.com/logo512.png",
            "applicationCategory": "BrowserExtension",
            "operatingSystem": ["Firefox", "Chrome"],
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "RUB",
              "availability": "https://schema.org/InStock"
            },
            "author": {
              "@type": "Organization",
              "name": "GetLifeUndo Team",
              "url": "https://getlifeundo.com"
            },
            "keywords": "восстановление данных, браузерное расширение, восстановление вкладок, отмена действий, Firefox расширение, Chrome расширение, локальное восстановление",
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
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
