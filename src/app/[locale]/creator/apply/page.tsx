import { SUPPORTED } from '@/utils/i18nPath';
import CreatorApplyClient from './CreatorApplyClient';

export async function generateStaticParams() {
  return SUPPORTED.map((locale) => ({ locale }));
}

export default function CreatorApplyPage({ params }: { params: { locale: string } }) {
  return <CreatorApplyClient params={params} />;
}
