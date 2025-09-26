import "./globals.css";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://getlifeundo.com'),
  title: {
    default: 'LifeUndo — Ctrl+Z для онлайн-жизни',
    template: '%s — LifeUndo',
  },
  description:
    'Возвращайте случайно удалённый текст и прошлые версии ввода. Локально, без телеметрии.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: 'https://getlifeundo.com/',
    title: 'LifeUndo — Ctrl+Z для онлайн-жизни',
    description: 'Локальная история ввода и буфера. Без телеметрии.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
