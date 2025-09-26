import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey } from "@/lib/apiAuth";
import { incrUsage } from "@/lib/usage";
import { db } from "@/db/client";
import { licenses } from "@/db/schema";
import { eq } from "drizzle-orm";

// Legacy endpoint for backward compatibility
export async function POST(req: NextRequest){
  const api = await verifyApiKey(req.headers.get('authorization') || undefined);
  if(!api || api.revoked) return NextResponse.json({ ok:false, error: 'UNAUTHORIZED' }, { status:401 });
  const { key } = await req.json();
  const [lic] = await db.select().from(licenses).where(eq(licenses.key, key)).limit(1);
  await incrUsage(api.id);
  if(!lic || lic.revoked) return NextResponse.json({ ok:false }, { status:404 });
  return NextResponse.json({ ok:true, plan: lic.planCode, expiresAt: lic.expiresAt });
}

