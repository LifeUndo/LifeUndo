// middleware.ts
import createMiddleware from 'next-intl/middleware';
import intlConfig from './next-intl.config';

export default createMiddleware(intlConfig);

// исключаем api/статику, чтобы не было /ru/api/...
export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};

