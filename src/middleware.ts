import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'ru'],
  defaultLocale: 'ru',
  localeDetection: true,          // авто по Accept-Language + cookie=lang
  localePrefix: 'as-needed'       // без двойных префиксов
});

export const config = {
  matcher: [
    // не трогаем Next/статику/API/серв-файлы
    '/((?!_next|api|favicon\\.ico|site\\.webmanifest|robots\\.txt|sitemap\\.xml|.*\\.(?:png|jpg|jpeg|svg|webp|gif|ico)).*)'
  ]
};