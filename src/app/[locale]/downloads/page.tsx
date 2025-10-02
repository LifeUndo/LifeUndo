import DownloadsClient from './DownloadsClient';

export const dynamic = 'force-dynamic';

export default function Page({ params: { locale }}: { params: { locale: string }}) {
  return <DownloadsClient locale={locale} />;
}