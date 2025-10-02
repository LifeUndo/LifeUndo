import dynamicImport from 'next/dynamic';

export const dynamic = 'force-dynamic';

const DownloadsClient = dynamicImport(() => import('./DownloadsClient'), { ssr: false });

export default function Page() {
  return <DownloadsClient />;
}