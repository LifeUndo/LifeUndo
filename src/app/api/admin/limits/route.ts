import { NextRequest, NextResponse } from "next/server";
import { withAuthAndRBAC } from "@/lib/rbac/guard";
import { getSubscriptionWithUsage } from "@/lib/billing/subscription";

export const runtime = 'nodejs';

async function handleGet(req: NextRequest) {
  const context = (req as any).rbacContext;
  const org = context.org;
  
  if (!org) {
    return NextResponse.json({ ok: false, error: 'Organization not found' }, { status: 400 });
  }

  try {
    const subscription = await getSubscriptionWithUsage(org.id);

    if (!subscription) {
      return NextResponse.json({ 
        ok: false, 
        error: 'No active subscription found' 
      }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      org: org.slug,
      subscription: {
        status: subscription.status,
        planCode: subscription.plan.code,
        planName: subscription.plan.name,
        isOverLimit: subscription.isOverLimit,
        isInGrace: subscription.isInGrace,
        graceUntil: subscription.graceUntil?.toISOString(),
        daysUntilRenewal: subscription.daysUntilRenewal,
      },
      limits: subscription.quotas.map(quota => ({
        name: quota.name,
        window: quota.window,
        limit: quota.limit,
        used: quota.used,
        percentage: quota.percentage,
        isOverLimit: quota.percentage >= 100,
        isNearLimit: quota.percentage >= 80,
        resetAt: quota.resetAt?.toISOString(),
      })),
      warnings: subscription.quotas
        .filter(q => q.percentage >= 80)
        .map(q => ({
          quota: q.name,
          message: `Usage at ${q.percentage}% of limit`,
          percentage: q.percentage,
        })),
    });

  } catch (error) {
    console.error('Failed to get limits:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to retrieve limits' 
    }, { status: 500 });
  }
}

export const GET = withAuthAndRBAC(handleGet, {
  roles: ['admin', 'operator', 'auditor', 'partner'],
  requireOrg: true,
});

