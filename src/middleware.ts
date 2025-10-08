import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'ru'];
const defaultLocale = 'ru';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle root path redirect
  if (pathname === '/') {
    const acceptLanguage = request.headers.get('accept-language');
    const userLocale = acceptLanguage?.includes('ru') ? 'ru' : 'en';
    return NextResponse.redirect(new URL(`/${userLocale}`, request.url));
  }

  // Handle favicon and static files
  if (pathname.includes('.') || pathname.startsWith('/_next') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Use next-intl middleware for all other paths
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(ru|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};