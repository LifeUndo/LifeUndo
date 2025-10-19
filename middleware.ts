// middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const SUPPORTED = new Set(['ru', 'en']);

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const config = {
  // всё, кроме статики и API
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};

function rateLimit(ip: string, limit: number = 60, windowMs: number = 60000): boolean {
  const now = Date.now();
  const key = ip;
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // HSTS (only for HTTPS)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  // CSP устанавливается централизованно в next.config.mjs -> headers()

  return response;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';

  // Rate limiting for payment API
  if (pathname.startsWith('/api/payments/')) {
    if (!rateLimit(ip, 10, 60000)) { // 10 requests per minute
      return new NextResponse('Rate limit exceeded', { status: 429 });
    }
  }

  // уже локализованные пути пропускаем
  const first = pathname.split('/')[1];
  if (SUPPORTED.has(first)) {
    const response = NextResponse.next();
    return addSecurityHeaders(response);
  }

  // корень → /ru
  if (pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = '/ru';
    const response = NextResponse.redirect(url);
    return addSecurityHeaders(response);
  }

  // любой путь без локали → /ru/<остальной-путь>
  const url = req.nextUrl.clone();
  url.pathname = `/ru${pathname}`;
  const response = NextResponse.redirect(url);
  return addSecurityHeaders(response);
}

