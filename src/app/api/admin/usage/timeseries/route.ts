import { NextResponse } from "next/server";
import { currentTenant } from "@/lib/tenant";
import { usageTimeseries } from "@/lib/usage-queries";
import { checkBasicAuth } from "@/lib/basicAuth";

export async function GET(req: Request) {
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '';
  const auth = checkBasicAuth(req.headers.get("authorization") || undefined, clientIp);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const days = Number(url.searchParams.get('days') || 7);
  const tenant = await currentTenant();
  const data = await usageTimeseries(tenant?.id, days);
  return NextResponse.json({ ok: true, tenant: tenant?.slug, days, series: data });
}

