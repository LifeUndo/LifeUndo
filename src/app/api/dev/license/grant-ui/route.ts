import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Check if we're in Preview/Dev environment
    const isPreviewOrDev = process.env.VERCEL_ENV !== 'production';
    const isDevEnabled = process.env.DEV_SIMULATE_WEBHOOK_ENABLED === 'true';
    
    if (!(isDevEnabled && isPreviewOrDev)) {
      return NextResponse.json({ error: 'Dev mode disabled' }, { status: 403 });
    }

    const body = await request.json();
    const { email, plan } = body;

    if (!email || !plan) {
      return NextResponse.json({ error: 'Missing email or plan' }, { status: 400 });
    }

    // Call the actual grant API with server-side token
    const adminToken = process.env.ADMIN_GRANT_TOKEN;
    if (!adminToken) {
      return NextResponse.json({ error: 'Admin token not configured' }, { status: 500 });
    }

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
      return NextResponse.json(grantData);
    } else {
      return NextResponse.json(grantData, { status: grantResponse.status });
    }

  } catch (error) {
    console.error('UI Grant error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
