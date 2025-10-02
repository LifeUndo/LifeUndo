import createMiddleware from 'next-intl/middleware';

// ВАЖНО: конфиг — прямо здесь, без импортов из файлов.
const intl = createMiddleware({
  locales: ['ru', 'en'],
  defaultLocale: 'ru',
});

export default intl;

// Роуты для i18n, исключая статику и API
export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};

