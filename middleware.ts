import createMiddleware from 'next-intl/middleware';

const intl = createMiddleware({
  locales: ['ru', 'en'],
  defaultLocale: 'ru'
});

export default intl;

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};

