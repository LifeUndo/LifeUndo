import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Guard: production check
    if (process.env.VERCEL_ENV === 'production') {
      return NextResponse.json({ ok: false, code: 'FORBIDDEN' }, { status: 403 });
    }

    // Guard: dev mode check
    if (process.env.DEV_SIMULATE_WEBHOOK_ENABLED !== 'true') {
      return NextResponse.json({ ok: false, code: 'DEV_DISABLED' }, { status: 400 });
    }

    // Guard: database check
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { 
          ok: false, 
          code: 'NO_DATABASE_URL', 
          message: 'DATABASE_URL is not set for Preview. Connect a DB to use test license.' 
        }, 
        { status: 400 }
      );
    }

    const body = await request.json();
    const { email, plan } = body;

    if (!email || !plan) {
      return NextResponse.json({ ok: false, code: 'MISSING_PARAMS', message: 'Missing email or plan' }, { status: 400 });
    }

    // Call the actual grant API with server-side token
    const adminToken = process.env.ADMIN_GRANT_TOKEN;
    if (!adminToken) {
      return NextResponse.json({ ok: false, code: 'NO_ADMIN_TOKEN', message: 'Admin token not configured' }, { status: 500 });
    }

    try {
      const grantResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/dev/license/grant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': adminToken,
        },
        body: JSON.stringify({ email, plan }),
      });

      const grantData = await grantResponse.json();
      
      if (grantResponse.ok) {
        return NextResponse.json({
          ok: true,
          order_id: grantData.order_id,
          email: grantData.email,
          level: grantData.level,
          expires_at: grantData.expires_at,
          plan: grantData.plan || body.plan,
          bonus_flag: grantData.bonusFlag
        });
      } else {
        return NextResponse.json({ 
          ok: false, 
          code: 'GRANT_FAILED', 
          message: grantData.error || 'Grant failed' 
        }, { status: grantResponse.status });
      }
    } catch (dbError) {
      console.error('[DevGrant] Database error:', dbError);
      return NextResponse.json(
        { ok: false, code: 'DB_ERROR', message: 'Database error in Preview.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('[DevGrant] Unexpected error:', error);
    return NextResponse.json({ 
      ok: false,
      code: 'INTERNAL_ERROR',
      message: 'Internal server error'
    }, { status: 500 });
  }
}
