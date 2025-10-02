// middleware.ts  (корень)
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Матчим корень и все страницы, кроме статики и /api
export const config = {
  matcher: ['/', '/((?!api|_next|.*\\..*).*)'],
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Корень -> /ru (можно поменять на /en)
  if (pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = '/ru';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

