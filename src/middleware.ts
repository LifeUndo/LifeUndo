import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['ru', 'en'],
  defaultLocale: 'ru',
  localePrefix: 'as-needed',
  localeDetection: true
});

export const config = {
  matcher: [
    // не трогаем api, статику, файлы; обрабатываем всё остальное
    '/((?!api|_next|.*\\..*|favicon.ico|robots.txt|sitemap.xml).*)'
  ]
};
