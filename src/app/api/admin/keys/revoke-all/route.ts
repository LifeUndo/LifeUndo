import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { sql } from "drizzle-orm";
import { currentTenant } from "@/lib/tenant";

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const tenant = await currentTenant();
  if (!tenant?.id) return NextResponse.json({ ok: false }, { status: 400 });

  const res = await db.execute(sql`
    UPDATE tenant_api_keys
    SET active = false
    WHERE tenant_id = ${tenant.id} AND active = true
  `);

  return NextResponse.json({
    ok: true,
    revokedAll: true,
    affected: (res as any).rowCount ?? undefined,
    note: 'Все активные ключи деактивированы. Создайте новый ключ через POST /api/admin/keys.',
  });
}

