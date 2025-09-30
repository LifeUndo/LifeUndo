import "./[locale]/globals.css";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://lifeundo.ru'),
  title: {
    default: 'GetLifeUndo — Ctrl+Z для онлайн-жизни',
    template: '%s — GetLifeUndo',
  },
  description:
    'Возвращайте случайно удалённый текст и прошлые версии ввода. Локально, без телеметрии.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: 'https://lifeundo.ru/',
    title: 'GetLifeUndo — Ctrl+Z для онлайн-жизни',
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
