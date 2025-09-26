import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit, timingSafeEqualStr } from "@/lib/security";
import { checkBasicAuth } from "@/lib/basicAuth";

export async function middleware(req: NextRequest) {
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.ip || '';

  // simple rate limiting on global requests (adjust thresholds)
  if (!checkRateLimit(clientIp, 300, 60_000)) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  const adminPaths = ["/admin", "/api/admin", "/drizzle"];
  const isAdmin = adminPaths.some((p) => req.nextUrl.pathname.startsWith(p));
  if (isAdmin) {
    const ok = checkBasicAuth(req.headers.get("authorization") || undefined, clientIp);
    if (!ok) {
      const res = new NextResponse("Auth required", { status: 401 });
      res.headers.set("WWW-Authenticate", 'Basic realm="getlifeundo"');
      // security headers
      res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
      res.headers.set("X-Frame-Options", "DENY");
      res.headers.set("X-Content-Type-Options", "nosniff");
      res.headers.set("Referrer-Policy", "no-referrer");
      res.headers.set("Permissions-Policy", "geolocation=(), microphone=()");
      res.headers.set("Content-Security-Policy", "default-src 'self' https:; script-src 'self' 'unsafe-inline'; object-src 'none';");
      return res;
    }
  }

  // Auto-usage logging for API endpoints (only if DATABASE_URL is available)
  const { pathname, origin } = req.nextUrl;
  const skip =
    pathname.startsWith('/api/_usage') ||
    pathname.startsWith('/api/admin');

  if (!skip && pathname.startsWith('/api/') && process.env.DATABASE_URL) {
    const internalKey = process.env.INTERNAL_USAGE_KEY;
    // fire-and-forget, без await
    try {
      fetch(`${origin}/api/_usage`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-internal-key': internalKey || '',
        },
        body: JSON.stringify({ endpoint: pathname }),
        // в middleware нельзя ставить keepalive: true, но обычный fetch ок
      }).catch(() => {});
    } catch {}
  }

  // set global security headers for all responses
  const response = NextResponse.next();
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("Permissions-Policy", "geolocation=(), microphone=()");
  response.headers.set("Content-Security-Policy", "default-src 'self' https:; script-src 'self' 'unsafe-inline'; object-src 'none';");

  return response;
}

export const config = { 
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ]
};
