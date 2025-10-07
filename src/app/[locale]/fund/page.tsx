import { SUPPORTED } from '@/utils/i18nPath';
import FundPageClient from './FundPageClient';

export async function generateStaticParams() {
  return SUPPORTED.map((locale) => ({ locale }));
}

export default function FundPage({ params }: { params: { locale: string } }) {
  return <FundPageClient params={params} />;
}