import { SUPPORTED } from '@/utils/i18nPath';
import CreatorPartnerClient from './CreatorPartnerClient';

export async function generateStaticParams() {
  return SUPPORTED.map((locale) => ({ locale }));
}

export default function CreatorPartnerPage({ params }: { params: { locale: string } }) {
  return <CreatorPartnerClient params={params} />;
}
