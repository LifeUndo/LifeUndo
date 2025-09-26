import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { sql } from "drizzle-orm";
import { currentTenant } from "@/lib/tenant";

export const runtime = 'nodejs'; // DB нужен узлу

export async function POST(req: Request) {
  try {
    // валидация внутреннего ключа как у вас было
    const key = req.headers.get('x-internal-key') || '';
    if (!process.env.INTERNAL_USAGE_KEY || key !== process.env.INTERNAL_USAGE_KEY) {
      return NextResponse.json({ ok: false }, { status: 403 });
    }

    const data = await req.json().catch(() => ({}));
    const { path, method, status, duration_ms } = data || {};
    // resolve tenant по домену/резолверу
    const tenant = await currentTenant();
    if (!tenant?.id) return NextResponse.json({ ok: false }, { status: 400 });

    await db.execute(sql`
      INSERT INTO usage_events (tenant_id, ts, path, method, status, duration_ms)
      VALUES (${tenant.id}, NOW(), ${path || ''}, ${method || ''}, ${status ?? 0}, ${duration_ms ?? null})
    `);

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
