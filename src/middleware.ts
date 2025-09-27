import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiter
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function rateLimit(ip: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const key = ip;
  const current = rateLimitStore.get(key);

  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (current.count >= limit) {
    return false;
  }

  current.count++;
  return true;
}

function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  const cfConnectingIP = req.headers.get('cf-connecting-ip');
  
  return cfConnectingIP || realIP || forwarded?.split(',')[0] || 'unknown';
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/partner/:path*',
    '/api/admin/:path*',
    '/api/private/:path*',
    '/api/fk/:path*',
    '/api/email/:path*'
  ],
};

export default function middleware(req: NextRequest) {
  const ip = getClientIP(req);
  const pathname = req.nextUrl.pathname;

  // Rate limiting for sensitive API routes
  if (pathname.startsWith('/api/fk/') || pathname.startsWith('/api/email/')) {
    if (!rateLimit(ip, 10, 60000)) { // 10 requests per minute
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }
  }

  // Admin/Partner routes - require authentication
  if (pathname.startsWith('/admin/') || pathname.startsWith('/partner/') || 
      pathname.startsWith('/api/admin/') || pathname.startsWith('/api/private/')) {
    
    const authHeader = req.headers.get('authorization');
    const adminToken = process.env.ADMIN_TOKEN;
    
    if (!adminToken) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.substring(7);
    if (token !== adminToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  }

  // Security headers
  const response = NextResponse.next();
  
  // CORS - restrict to our domains only
  const origin = req.headers.get('origin');
  const allowedOrigins = [
    'https://www.getlifeundo.com',
    'https://getlifeundo.com',
    'https://lifeundo.ru'
  ];
  
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }
  
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('X-RateLimit-Limit', '10');
  response.headers.set('X-RateLimit-Remaining', '9');
  
  return response;
}