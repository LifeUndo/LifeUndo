import { NextResponse } from "next/server";
import { getActivePlans } from "@/lib/billing/plans";

export const runtime = 'nodejs';

export async function GET() {
  try {
    const plans = await getActivePlans();

    // Форматируем ответ для публичного API
    const publicPlans = plans.map(plan => ({
      id: plan.id,
      code: plan.code,
      name: plan.name,
      description: plan.description,
      priceCents: plan.priceCents,
      currency: plan.currency,
      billingCycle: plan.billingCycle,
      features: plan.features,
      quotas: plan.quotas.map(quota => ({
        name: quota.name,
        limit: quota.limit,
        window: quota.window,
      })),
    }));

    return NextResponse.json({
      ok: true,
      plans: publicPlans,
    });

  } catch (error) {
    console.error('Failed to get billing plans:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to retrieve plans' 
    }, { status: 500 });
  }
}


