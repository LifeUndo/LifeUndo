// i18n.js
export function t(key, vars = {}) {
  const msg = browser.i18n.getMessage(key);
  if (!msg) return key;
  return Object.keys(vars).reduce((s, k) => s.replace(new RegExp(`\\$${k}\\$`, 'g'), vars[k]), msg);
}

export async function getLang() {
  const { langOverride } = await browser.storage.local.get('langOverride');
  return langOverride || browser.i18n.getUILanguage().split('-')[0];
}

export async function setLang(lang) {
  await browser.storage.local.set({ langOverride: lang });
  // простая перезагрузка для применения
  if (location.href.includes('options.html')) location.reload();
}
