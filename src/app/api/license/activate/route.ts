import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey } from "@/lib/apiAuth";
import { incrUsage } from "@/lib/usage";
import { db } from "@/db/client";
import { activations, licenses } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// Legacy endpoint for backward compatibility
export async function POST(req: NextRequest){
  const api = await verifyApiKey(req.headers.get('authorization') || undefined);
  if(!api || api.revoked) return NextResponse.json({ ok:false, error: 'UNAUTHORIZED' }, { status:401 });
  const { key, deviceId, deviceName } = await req.json();
  const [lic] = await db.select().from(licenses).where(and(eq(licenses.key, key), eq(licenses.revoked, false))).limit(1);
  await incrUsage(api.id);
  if(!lic) return NextResponse.json({ ok:false, error:'INVALID_KEY' }, { status:400 });
  await db.insert(activations).values({ licenseId: lic.id, deviceId, deviceName });
  return NextResponse.json({ ok:true, plan: lic.planCode, expiresAt: lic.expiresAt });
}

