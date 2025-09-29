// src/middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const config = {
  matcher: [
    '/', 
    '/((?!_next/|static/|favicon|robots\\.txt|sitemap\\.xml|ok|api/).*)'
  ],
};

export function middleware(req: NextRequest) {
  try {
    const url = req.nextUrl;
    const host = req.headers.get('host') || '';

    // ТОЛЬКО корень -> /ru на основном домене
    if (host === 'getlifeundo.com' && url.pathname === '/') {
      const target = url.clone();
      target.pathname = '/ru';
      return NextResponse.redirect(target, 308);
    }

    // ВСЕ ОСТАЛЬНЫЕ РЕДИРЕКТЫ ТОЛЬКО В VERCEL DOMAINS!
    return NextResponse.next();
  } catch {
    return NextResponse.next();
  }
}