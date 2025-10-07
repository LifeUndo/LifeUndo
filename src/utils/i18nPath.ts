// utils/i18nPath.ts
export const SUPPORTED = ['en','ru','hi','zh','ar','kk','tr'] as const;
export type Locale = typeof SUPPORTED[number];

export function switchLocalePath(pathname: string, to: Locale) {
  const segs = pathname.split('/').filter(Boolean);
  const rest = SUPPORTED.includes(segs[0] as Locale) ? segs.slice(1) : segs;
  return `/${to}/${rest.join('/')}`;
}

export function isValidLocale(locale: string): locale is Locale {
  return SUPPORTED.includes(locale as Locale);
}
