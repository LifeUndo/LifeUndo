import "./[locale]/globals.css";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://lifeundo.ru'),
  title: {
    default: 'LifeUndo — Ctrl+Z для онлайн-жизни',
    template: '%s — LifeUndo',
  },
  description:
    'Возвращайте случайно удалённый текст и прошлые версии ввода. Локально, без телеметрии.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: 'https://lifeundo.ru/',
    title: 'LifeUndo — Ctrl+Z для онлайн-жизни',
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
