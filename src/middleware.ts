import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Не пускаем middleware на служебные пути
export const config = {
  matcher: [
    // всё, кроме статики/_next, API, ok, robots, sitemap
    '/((?!_next/|favicon.ico|robots.txt|sitemap.xml|ok|api/).*)',
  ],
}

const CANONICAL_HOST = 'www.getlifeundo.com'

// хелпер: добавляем /ru только если его нет
function ensureRuPrefix(pathname: string) {
  if (pathname === '/') return '/ru'
  if (pathname.startsWith('/ru') || pathname.startsWith('/en')) return pathname
  return `/ru${pathname.startsWith('/') ? '' : '/'}${pathname}`
}

export function middleware(req: NextRequest) {
  try {
    const { nextUrl } = req
    const host = req.headers.get('host')?.toLowerCase() || ''
    const pathname = nextUrl.pathname
    const search = nextUrl.search // сохраняем query

    // 1) Все .ru домены → www.getlifeundo.com/ru + сохранение пути и query
    if (host.endsWith('lifeundo.ru')) {
      const target = new URL(`https://${CANONICAL_HOST}${ensureRuPrefix(pathname)}${search}`)
      return NextResponse.redirect(target, 308)
    }

    // 2) getlifeundo.com (без www) → www.getlifeundo.com (сохранить путь и query)
    if (host === 'getlifeundo.com') {
      const target = new URL(`https://${CANONICAL_HOST}${pathname}${search}`)
      return NextResponse.redirect(target, 308)
    }

    // 3) На каноническом www:
    if (host === CANONICAL_HOST) {
      // только корень → /ru
      if (pathname === '/') {
        const target = new URL(`https://${CANONICAL_HOST}/ru${search}`)
        return NextResponse.redirect(target, 308)
      }
      // если нет префикса /ru|/en — добавить /ru (сохранить остальной путь)
      if (!pathname.startsWith('/ru') && !pathname.startsWith('/en')) {
        const target = new URL(`https://${CANONICAL_HOST}${ensureRuPrefix(pathname)}${search}`)
        return NextResponse.redirect(target, 308)
      }
    }

    // остальное пропускаем
    return NextResponse.next()
  } catch {
    return NextResponse.next()
  }
}