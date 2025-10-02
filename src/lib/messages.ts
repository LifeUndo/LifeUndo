import ru_common from '../../messages/ru/common.json';
import ru_downloads from '../../messages/ru/downloads.json';

import en_common from '../../messages/en/common.json';
import en_downloads from '../../messages/en/downloads.json';

const MAP: Record<string, Record<string, any>> = {
  ru: {common: ru_common, downloads: ru_downloads},
  en: {common: en_common, downloads: en_downloads},
};

export function getMessagesFor(locale: string, ns: string[]) {
  const byLocale = MAP[locale] ?? {};
  return ns.reduce((acc, n) => ({...acc, [n]: (byLocale[n] ?? {})}), {});
}
