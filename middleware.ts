// middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const SUPPORTED = new Set(['ru', 'en']);

export const config = {
  // всё, кроме статики и API
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // уже локализованные пути пропускаем
  const first = pathname.split('/')[1];
  if (SUPPORTED.has(first)) {
    return NextResponse.next();
  }

  // корень → /ru
  if (pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = '/ru';
    return NextResponse.redirect(url);
  }

  // любой путь без локали → /ru/<остальной-путь>
  const url = req.nextUrl.clone();
  url.pathname = `/ru${pathname}`;
  return NextResponse.redirect(url);
}

