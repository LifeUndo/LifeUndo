// src/lib/i18n.ts
export type Locale = 'ru' | 'en';

import ru_common from '../../messages/ru/common.json';
import ru_downloads from '../../messages/ru/downloads.json';
import en_common from '../../messages/en/common.json';
import en_downloads from '../../messages/en/downloads.json';

export const BUNDLE: Record<Locale, Record<string, Record<string, string>>> = {
  ru: { common: ru_common as any, downloads: ru_downloads as any },
  en: { common: en_common as any, downloads: en_downloads as any }
};

export function safeLocale(loc?: string): Locale {
  return loc === 'en' ? 'en' : 'ru';
}
