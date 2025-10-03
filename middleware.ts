import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';

// Только редирект c "/" на "/ru". НИЧЕГО больше.
export const config = {
  matcher: ['/']  // важно: не матчим /ru и прочее
};

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = '/ru';
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

