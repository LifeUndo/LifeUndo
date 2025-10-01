import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { payments, licenses, featureFlags } from '@/db/schema';
import { activateLicense } from '@/lib/payments/license';
import { fkPlans } from '@/lib/payments/fk-plans';

export async function POST(request: NextRequest) {
  try {
    // Check if we're in Preview/Dev environment
    const isPreviewOrDev = process.env.VERCEL_ENV !== 'production';
    const isDevEnabled = process.env.DEV_SIMULATE_WEBHOOK_ENABLED === 'true';
    
    if (!(isDevEnabled && isPreviewOrDev)) {
      return NextResponse.json({ error: 'Dev mode disabled' }, { status: 403 });
    }

    // Check admin token
    const adminToken = request.headers.get('X-Admin-Token');
    const expectedToken = process.env.ADMIN_GRANT_TOKEN;
    
    if (!adminToken || !expectedToken || adminToken !== expectedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email, plan } = body;

    if (!email || !plan) {
      return NextResponse.json({ error: 'Missing email or plan' }, { status: 400 });
    }

    // Validate plan
    const planConfig = fkPlans[plan as keyof typeof fkPlans];
    if (!planConfig) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Generate order ID
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const orderId = `GRANT-${timestamp}-${random}`;

    // Create payment record
    await db.insert(payments).values({
      orderId,
      userEmail: email,
      amount: planConfig.amount,
      currency: planConfig.currency,
      plan: plan,
      status: 'paid',
      paymentMethod: 'admin_grant',
      createdAt: new Date(),
    });

    // Activate license
    const licenseResult = await activateLicense({
      orderId,
      userEmail: email,
      plan: plan,
      amount: planConfig.amount,
      currency: planConfig.currency,
    });

    if (!licenseResult.success) {
      return NextResponse.json({ 
        error: 'Failed to activate license', 
        details: licenseResult.error 
      }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      orderId,
      email,
      level: licenseResult.level,
      expiresAt: licenseResult.expiresAt,
      bonusFlag: licenseResult.bonusFlag,
    });

  } catch (error) {
    console.error('Admin grant error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
