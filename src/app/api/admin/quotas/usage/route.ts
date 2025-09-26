import { NextRequest, NextResponse } from "next/server";
import { withAuthAndRBAC } from "@/lib/rbac/guard";
import { getOrgUsageCounters } from "@/lib/billing/usage";

export const runtime = 'nodejs';

async function handleGet(req: NextRequest) {
  const context = (req as any).rbacContext;
  const org = context.org;
  
  if (!org) {
    return NextResponse.json({ ok: false, error: 'Organization not found' }, { status: 400 });
  }

  try {
    const usageCounters = await getOrgUsageCounters(org.id);

    return NextResponse.json({
      ok: true,
      org: org.slug,
      usage: usageCounters.map(counter => ({
        name: counter.name,
        window: counter.window,
        limit: counter.limit,
        used: counter.used,
        percentage: counter.percentage,
        resetAt: counter.resetAt.toISOString(),
        isOverLimit: counter.percentage >= 100,
        isNearLimit: counter.percentage >= 80,
      })),
    });

  } catch (error) {
    console.error('Failed to get usage counters:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to retrieve usage data' 
    }, { status: 500 });
  }
}

export const GET = withAuthAndRBAC(handleGet, {
  roles: ['admin', 'operator', 'auditor', 'partner'],
  requireOrg: true,
});

