import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    '/admin/:path*',
    '/partner/:path*',
    '/api/admin/:path*',
    '/api/private/:path*'
  ],
};

export default function middleware(req: NextRequest) {
  // Временная проверка - если нет токена, возвращаем 401
  const token = req.cookies.get("auth")?.value || req.headers.get("authorization");
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // TODO: добавить валидацию токена/сессии
  return NextResponse.next();
}