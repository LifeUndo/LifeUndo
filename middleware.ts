import { NextResponse } from "next/server";

const locales = ["ru", "en"];
const defaultLocale = "ru";

// Игнорируем файлы, _next и api
const IGNORE = /^\/(_next|api)(\/|$)|\.[a-z0-9]+$/i;

export function middleware(req: Request) {
  const url = new URL(req.url);
  const { pathname } = url;

  if (IGNORE.test(pathname)) return;

  // Первый сегмент пути
  const seg = pathname.split("/")[1];

  // Если путь уже с локалью — пропускаем
  if (locales.includes(seg)) return;

  // Иначе подставляем defaultLocale
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.rewrite(url); // rewrite, чтобы не менять адрес в адресной строке
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
