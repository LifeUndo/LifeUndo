import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { sql } from "drizzle-orm";
import { currentTenant } from "@/lib/tenant";

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const tenant = await currentTenant();
  if (!tenant?.id) return NextResponse.json({ ok: false }, { status: 400 });

  const [{ used }] = (await db.execute(sql`
    SELECT COUNT(*)::int AS used
    FROM usage_events
    WHERE tenant_id=${tenant.id} AND ts >= date_trunc('month', now())
  `)).rows as any[];

  // Берём лимит из tenant_plans → plans → ENV
  const planRow = (await db.execute(sql`
    SELECT COALESCE(tp.monthly_limit, p.monthly_limit) AS lim
    FROM tenants t
    LEFT JOIN tenant_plans tp ON tp.tenant_id=t.id
    LEFT JOIN plans p ON p.code = tp.plan_code
    WHERE t.id=${tenant.id}
    LIMIT 1
  `)).rows[0] as any;

  const envDefault = Number(process.env.DEFAULT_MONTH_LIMIT || 100000);
  const limit = Number(planRow?.lim ?? envDefault) || envDefault;

  const start = new Date();
  start.setUTCDate(1); start.setUTCHours(0,0,0,0);
  const resetAt = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth()+1, 1));

  return NextResponse.json({
    ok: true,
    tenant: tenant.slug,
    usedMonth: used || 0,
    monthLimit: limit,
    remaining: Math.max(0, (limit || 0) - (used || 0)),
    resetAt: resetAt.toISOString(),
  });
}

