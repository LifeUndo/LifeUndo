import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { locales } from './config';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: {
      common: (await import(`../messages/${locale}/common.json`)).default,
      pricing: (await import(`../messages/${locale}/pricing.json`)).default,
      success: (await import(`../messages/${locale}/success.json`)).default,
      features: (await import(`../messages/${locale}/features.json`)).default,
      support: (await import(`../messages/${locale}/support.json`)).default,
      account: (await import(`../messages/${locale}/account.json`)).default,
    }
  };
});
