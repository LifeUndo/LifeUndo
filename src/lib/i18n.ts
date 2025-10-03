// src/lib/i18n.ts
export type Locale = 'ru' | 'en';

// Используем require для совместимости с серверными компонентами
const ru_common = require('../../messages/ru/common.json');
const ru_downloads = require('../../messages/ru/downloads.json');
const en_common = require('../../messages/en/common.json');
const en_downloads = require('../../messages/en/downloads.json');

export const BUNDLE: Record<Locale, Record<string, Record<string, string>>> = {
  ru: { common: ru_common, downloads: ru_downloads },
  en: { common: en_common, downloads: en_downloads }
};

export function safeLocale(loc?: string): Locale {
  return loc === 'en' ? 'en' : 'ru';
}
