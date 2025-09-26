import { NextResponse } from "next/server";
import { currentTenant } from "@/lib/tenant";
import { usageSummary } from "@/lib/usage-queries";
import { checkBasicAuth } from "@/lib/basicAuth";

export async function GET(req: Request) {
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '';
  const auth = checkBasicAuth(req.headers.get("authorization") || undefined, clientIp);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const tenant = await currentTenant();
  const data = await usageSummary(tenant?.id);
  return NextResponse.json({ ok: true, tenant: tenant?.slug, ...data });
}

