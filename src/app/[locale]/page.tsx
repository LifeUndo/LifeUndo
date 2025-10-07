import { SUPPORTED } from '@/utils/i18nPath';
import LocaleIndexClient from './LocaleIndexClient';

export async function generateStaticParams() {
  return SUPPORTED.map((locale) => ({ locale }));
}

export default function LocaleIndex({ params }: { params: { locale: string } }) {
  return <LocaleIndexClient params={params} />;
}