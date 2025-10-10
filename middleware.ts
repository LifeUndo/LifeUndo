import { NextResponse, NextRequest } from "next/server";

const locales = ["ru", "en"];
const defaultLocale = "ru";

// Мидлварь для подстановки /ru, если локаль не задана.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Игнорируем _next, api и любые файлы c расширением
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Первый сегмент пути
  const seg = pathname.split("/")[1] || "";

  // Если локаль уже есть — пропускаем
  if (locales.includes(seg)) {
    return NextResponse.next();
  }

  // Иначе — переписываем на /ru/...
  const url = req.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Пусть идёт на все пути, мы сами фильтруем внутри
  matcher: ["/:path*"],
};
