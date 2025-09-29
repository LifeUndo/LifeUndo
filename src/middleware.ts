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

    // 1) lifeundo.ru и www.lifeundo.ru -> getlifeundo.com/ru (с сохранением пути)
    if (host.endsWith('lifeundo.ru')) {
      const target = new URL(url, 'https://getlifeundo.com');
      // если путь уже начинается с /ru — не дублируем
      if (!target.pathname.startsWith('/ru')) {
        target.pathname = '/ru' + (target.pathname === '/' ? '' : target.pathname);
      }
      return NextResponse.redirect(target, 301);
    }

    // 2) www.getlifeundo.com -> getlifeundo.com (без /ru здесь — домены в Vercel доделают)
    if (host === 'www.getlifeundo.com') {
      const target = new URL(url, 'https://getlifeundo.com');
      return NextResponse.redirect(target, 301);
    }

    // 3) На основном домене корень -> /ru (иначе 404, т.к. у нас /[locale])
    if (host === 'getlifeundo.com' && url.pathname === '/') {
      const target = url.clone();
      target.pathname = '/ru';
      return NextResponse.redirect(target, 308);
    }

    return NextResponse.next();
  } catch {
    return NextResponse.next();
  }
}