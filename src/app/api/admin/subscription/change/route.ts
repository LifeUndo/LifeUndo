import { NextRequest, NextResponse } from "next/server";
import { withAuthAndRBAC } from "@/lib/rbac/guard";
import { changeSubscriptionPlan } from "@/lib/billing/subscription";

export const runtime = 'nodejs';

async function handlePost(req: NextRequest) {
  const context = (req as any).rbacContext;
  const org = context.org;
  
  if (!org) {
    return NextResponse.json({ ok: false, error: 'Organization not found' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { plan_code, proration_note } = body;

    if (!plan_code) {
      return NextResponse.json({ 
        ok: false, 
        error: 'plan_code is required' 
      }, { status: 400 });
    }

    const result = await changeSubscriptionPlan(org.id, plan_code, proration_note);

    if (!result.success) {
      return NextResponse.json({ 
        ok: false, 
        error: result.message 
      }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      message: result.message,
      subscription: result.subscription ? {
        id: result.subscription.id,
        planId: result.subscription.planId,
        status: result.subscription.status,
        currentPeriodStart: result.subscription.currentPeriodStart.toISOString(),
        currentPeriodEnd: result.subscription.currentPeriodEnd.toISOString(),
        plan: {
          id: result.subscription.plan.id,
          code: result.subscription.plan.code,
          name: result.subscription.plan.name,
          priceCents: result.subscription.plan.priceCents,
          currency: result.subscription.plan.currency,
          billingCycle: result.subscription.plan.billingCycle,
          features: result.subscription.plan.features,
        },
      } : null,
    });

  } catch (error: any) {
    console.error('Failed to change subscription plan:', error);
    return NextResponse.json({ 
      ok: false, 
      error: error.message || 'Failed to change subscription plan' 
    }, { status: 500 });
  }
}

export const POST = withAuthAndRBAC(handlePost, {
  roles: ['admin'],
  requireOrg: true,
});

