import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { sql } from "drizzle-orm";
import { currentTenant } from "@/lib/tenant";
import crypto from "crypto";

export const runtime = 'nodejs';

function genKey() {
  // человекочитаемый ключ с префиксом
  const raw = crypto.randomBytes(32).toString('base64url'); // ~43 символа
  return `lu_${raw}`;
}
function sha256(s: string) {
  return crypto.createHash('sha256').update(s).digest('hex');
}

export async function GET(req: Request) {
  const tenant = await currentTenant();
  if (!tenant?.id) return NextResponse.json({ ok: false }, { status: 400 });

  const row = (await db.execute(sql`
    SELECT last4, created_at
    FROM tenant_api_keys
    WHERE tenant_id = ${tenant.id} AND active = true
    ORDER BY created_at DESC
    LIMIT 1
  `)).rows[0] as any;

  return NextResponse.json({
    ok: true,
    tenant: tenant.slug,
    key: row ? { mask: `••••${row.last4}`, createdAt: row.created_at } : null,
  });
}

export async function POST(req: Request) {
  const tenant = await currentTenant();
  if (!tenant?.id) return NextResponse.json({ ok: false }, { status: 400 });

  const apiKey = genKey();
  const hash = sha256(apiKey);
  const last4 = apiKey.slice(-4);

  // деактивируем старые и создаём новый
  await db.execute(sql`UPDATE tenant_api_keys SET active=false WHERE tenant_id=${tenant.id} AND active=true`);
  await db.execute(sql`
    INSERT INTO tenant_api_keys (tenant_id, key_hash, last4, active)
    VALUES (${tenant.id}, ${hash}, ${last4}, true)
  `);

  // Возвращаем PLAINTEXT только здесь, затем его нигде не показываем
  return NextResponse.json({ ok: true, apiKey, last4 });
}

export async function DELETE(req: Request) {
  const tenant = await currentTenant();
  if (!tenant?.id) return NextResponse.json({ ok: false }, { status: 400 });

  // Деактивируем ТОЛЬКО текущий активный ключ
  await db.execute(sql`
    UPDATE tenant_api_keys
    SET active = false
    WHERE tenant_id = ${tenant.id} AND active = true
  `);

  return NextResponse.json({ ok: true, revoked: true });
}