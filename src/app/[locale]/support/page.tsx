import { SUPPORTED } from '@/utils/i18nPath';
import SupportPageClient from './SupportPageClient';

export async function generateStaticParams() {
  return SUPPORTED.map((locale) => ({ locale }));
}

export default function SupportPage({ params }: { params: { locale: string } }) {
  return <SupportPageClient params={params} />;
}