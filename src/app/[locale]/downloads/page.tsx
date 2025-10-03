'use client';

import DownloadsClient from './DownloadsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Page() {
  return <DownloadsClient />;
}