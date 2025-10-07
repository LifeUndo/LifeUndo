import { useParams } from 'next/navigation';
import ru from '@/i18n/ru';
import en from '@/i18n/en';
import hi from '@/i18n/hi';
import zh from '@/i18n/zh';
import ar from '@/i18n/ar';

export function useTranslations() {
  const params = useParams();
  const locale = params?.locale as string || 'ru';
  
  const translations = {
    ru,
    en,
    hi,
    zh,
    ar
  };
  
  const t = translations[locale as keyof typeof translations] || ru;
  
  return { t, locale };
}
