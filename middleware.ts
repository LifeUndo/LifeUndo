import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale } from "@/i18n/config";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Пропускаем API, статику, файлы
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|gif|css|js|json|xml|txt)$/)
  ) {
    return NextResponse.next();
  }
  
  // Проверяем наличие локали в пути
  const pathnameHasLocale = locales.some(
    locale => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  
  // Если локаль есть - пропускаем
  if (pathnameHasLocale) {
    return NextResponse.next();
  }
  
  // Редиректим на дефолтную локаль
  const url = req.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api).*)"]
};

