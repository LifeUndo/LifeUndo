import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const config = {
  matcher: ['/', '/((?!api|_next|.*\\..*).*)'],
};

export function middleware(req: NextRequest) {
  // Редиректим только корень сайта на /ru
  if (req.nextUrl.pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = '/ru';
    return NextResponse.redirect(url, 308); // постоянный редирект
  }
  return NextResponse.next();
}

