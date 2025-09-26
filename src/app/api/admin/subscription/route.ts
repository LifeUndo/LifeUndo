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
      subscription: {
        id: subscription.id,
        orgId: subscription.orgId,
        planId: subscription.planId,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart.toISOString(),
        currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
        trialEnd: subscription.trialEnd?.toISOString(),
        graceUntil: subscription.graceUntil?.toISOString(),
        createdAt: subscription.createdAt.toISOString(),
        updatedAt: subscription.updatedAt.toISOString(),
        plan: {
          id: subscription.plan.id,
          code: subscription.plan.code,
          name: subscription.plan.name,
          description: subscription.plan.description,
          priceCents: subscription.plan.priceCents,
          currency: subscription.plan.currency,
          billingCycle: subscription.plan.billingCycle,
          features: subscription.plan.features,
        },
        quotas: subscription.quotas,
        isOverLimit: subscription.isOverLimit,
        isInGrace: subscription.isInGrace,
        daysUntilRenewal: subscription.daysUntilRenewal,
      },
    });

  } catch (error) {
    console.error('Failed to get subscription:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to retrieve subscription' 
    }, { status: 500 });
  }
}

export const GET = withAuthAndRBAC(handleGet, {
  roles: ['admin', 'partner'],
  requireOrg: true,
});

