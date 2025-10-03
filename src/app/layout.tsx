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
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: 'https://getlifeundo.com/',
    title: 'GetLifeUndo — Ctrl+Z для вашей жизни в сети',
    description: 'Локальная история ввода и буфера. Без телеметрии.',
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
