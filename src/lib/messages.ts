import ru_common from '../../messages/ru/common.json';
import ru_pricing from '../../messages/ru/pricing.json';
import ru_downloads from '../../messages/ru/downloads.json';
import ru_account from '../../messages/ru/account.json';
import ru_support from '../../messages/ru/support.json';
import ru_features from '../../messages/ru/features.json';
import ru_success from '../../messages/ru/success.json';

import en_common from '../../messages/en/common.json';
import en_pricing from '../../messages/en/pricing.json';
import en_downloads from '../../messages/en/downloads.json';
import en_account from '../../messages/en/account.json';
import en_support from '../../messages/en/support.json';
import en_features from '../../messages/en/features.json';
import en_success from '../../messages/en/success.json';

const MAP: Record<string, Record<string, any>> = {
  ru: {common: ru_common, pricing: ru_pricing, downloads: ru_downloads, account: ru_account, support: ru_support, features: ru_features, success: ru_success},
  en: {common: en_common, pricing: en_pricing, downloads: en_downloads, account: en_account, support: en_support, features: en_features, success: en_success},
};

export function getMessagesFor(locale: string, ns: string[]) {
  const byLocale = MAP[locale] ?? {};
  return ns.reduce((acc, n) => ({...acc, [n]: (byLocale[n] ?? {})}), {});
}
