// src/middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const LOCALES = ['ru','en','zh','hi','ar','kk','uz','az'];
const localeReg = new RegExp(`^/(?:${LOCALES.join('|')})(?:/|$)`);

export const config = {
  matcher: ['/', '/((?!_next/|api/|.*\\.[\\w]+$).*)'],
};

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // уже локаль есть — пропускаем как есть
  if (localeReg.test(pathname)) return NextResponse.next();

  // только корень редиректим на /ru
  if (pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = '/ru';
    return NextResponse.redirect(url, 308);
  }

  // ничего больше не трогаем
  return NextResponse.next();
}
