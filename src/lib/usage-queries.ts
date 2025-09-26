import { db } from "@/db/client";
import { sql } from "drizzle-orm";

export async function usageSummary(tenantId?: number) {
  try {
    const where = tenantId ? sql`WHERE tenant_id = ${tenantId}` : sql``;
    const [{ total }] = (await db.execute(sql`
      SELECT COUNT(*)::int AS total FROM usage_events ${where}
    `)) as any[];
    const byEndpoint = (await db.execute(sql`
      SELECT endpoint, COUNT(*)::int AS c
      FROM usage_events ${where}
      GROUP BY endpoint
      ORDER BY c DESC
      LIMIT 10
    `)) as any[];
    return { total, byEndpoint };
  } catch {
    // мягкий фолбэк — если таблицы нет, вернём агрегаты по payments/licenses
    const [{ payments }] = (await db.execute(sql`SELECT COUNT(*)::int AS payments FROM payments`)) as any[];
    const [{ licenses }] = (await db.execute(sql`SELECT COUNT(*)::int AS licenses FROM licenses`)) as any[];
    return { total: (payments || 0) + (licenses || 0), byEndpoint: [] };
  }
}

export async function usageTimeseries(tenantId: number | undefined, days = 7) {
  try {
    const where = tenantId ? sql`tenant_id = ${tenantId}` : sql`TRUE`;
    const rows = (await db.execute(sql`
      SELECT date_trunc('day', ts) AS d, COUNT(*)::int AS c
      FROM usage_events
      WHERE ${where} AND ts >= now() - (${days}::int || ' days')::interval
      GROUP BY d
      ORDER BY d ASC
    `)) as any[];
    return rows.map((r) => ({ date: r.d, count: r.c }));
  } catch {
    return [] as { date: string; count: number }[];
  }
}

