import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const config = {
  // не трогаем статику/служебные
  matcher: ['/', '/((?!_next/|assets/|api/|ok|robots\\.txt|sitemap\\.xml|favicon\\.ico).*)'],
}

export function middleware(req: NextRequest) {
  try {
    const { pathname, origin } = req.nextUrl

    // корень → /ru (один раз), никаких склейкок /ru/ru
    if (pathname === '/') {
      const url = req.nextUrl.clone()
      url.pathname = '/ru'
      return NextResponse.redirect(url, 308)
    }

    // никаких хост-редиректов в коде (только через Vercel Domains)
    return NextResponse.next()
  } catch {
    // на любой ошибке — пропускаем, чтобы не уронить прод
    return NextResponse.next()
  }
}
