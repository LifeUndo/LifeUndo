import "./globals.css";
import ModernHeader from '@/components/ModernHeader';
import ModernFooter from '@/components/ModernFooter';

export default function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale}>
      <body className="min-h-dvh bg-[#0B1220] text-white antialiased">
        <ModernHeader />
        <main className="min-h-dvh">{children}</main>
        <ModernFooter />
      </body>
    </html>
  );
}
