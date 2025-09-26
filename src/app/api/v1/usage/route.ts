import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey } from "@/lib/apiAuth";
import { getApiUsage } from "@/lib/usage";

export async function GET(req: NextRequest){
  const api = await verifyApiKey(req.headers.get('authorization') || undefined);
  if(!api || api.revoked) return NextResponse.json({ ok:false, error: 'UNAUTHORIZED' }, { status:401 });
  
  const usage = await getApiUsage(api.id, api.planCode);
  return NextResponse.json({ 
    ok: true, 
    monthCalls: usage.monthCalls, 
    limit: usage.limit,
    remaining: Math.max(0, usage.limit - usage.monthCalls),
    resetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString()
  });
}
