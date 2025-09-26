import { db } from "@/db/client";

function ymNow(){
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}`;
}

export async function incrUsage(apiKeyId: number, n = 1){
  const ym = ymNow();
  try {
    await db.execute(
      `INSERT INTO api_usage(api_key_id, ym, calls) VALUES($1,$2,$3)
       ON CONFLICT (api_key_id, ym)
       DO UPDATE SET calls = api_usage.calls + EXCLUDED.calls, updated_at = now()`,
      [apiKeyId, ym, n]
    );
  } catch (error) {
    console.error('Error incrementing API usage:', error);
  }
}

export async function getUsage(apiKeyId: number){
  const ym = ymNow();
  try {
    const rows = await db.execute<{ calls: number }>(
      `SELECT calls FROM api_usage WHERE api_key_id=$1 AND ym=$2`,
      [apiKeyId, ym]
    );
    // @ts-ignore drizzle execute returns array-like
    return rows?.[0]?.calls ?? 0;
  } catch (error) {
    console.error('Error getting API usage:', error);
    return 0;
  }
}

function planLimit(planCode?: string){
  if (planCode === 'pro' || planCode === 'pro_m' || planCode === 'pro_y') return 250_000;
  if (planCode === 'team') return 1_000_000;
  return 10_000;
}

export async function getApiUsage(apiKeyId: number, planCode?: string): Promise<{ monthCalls: number; limit: number }> {
  const monthCalls = await getUsage(apiKeyId);
  const limit = planLimit(planCode);
  
  return { monthCalls, limit };
}
