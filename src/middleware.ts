import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['ru', 'en'],
  defaultLocale: 'ru',
  localePrefix: 'always',
  localeDetection: true
});

export const config = {
  matcher: [
    // обрабатываем все кроме api, _next, статических файлов
    '/((?!api|_next|.*\\..*|favicon.ico|robots.txt|sitemap.xml).*)'
  ]
};
