import { NextRequest, NextResponse } from "next/server";
import { withAuthAndRBAC } from "@/lib/rbac/guard";
import { db } from "@/db/client";
import { sql } from "drizzle-orm";

export const runtime = 'nodejs';

async function handleRevoke(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const context = (req as any).rbacContext;
  const org = context.org;
  const keyId = params.id;
  
  if (!org) {
    return NextResponse.json({ ok: false, error: 'Organization not found' }, { status: 400 });
  }

  // Проверяем существование ключа
  const keyCheck = await db.execute(sql`
    SELECT id, name, revoked_at
    FROM api_keys
    WHERE id = ${keyId} AND org_id = ${org.id}
  `);

  if (keyCheck.rows.length === 0) {
    return NextResponse.json({ ok: false, error: 'API key not found' }, { status: 404 });
  }

  const key = keyCheck.rows[0] as any;

  if (key.revoked_at) {
    return NextResponse.json({ ok: false, error: 'API key already revoked' }, { status: 400 });
  }

  // Отзываем ключ
  const result = await db.execute(sql`
    UPDATE api_keys 
    SET revoked_at = now()
    WHERE id = ${keyId} AND org_id = ${org.id}
    RETURNING id, name, revoked_at
  `);

  if (result.rows.length === 0) {
    return NextResponse.json({ ok: false, error: 'Failed to revoke API key' }, { status: 500 });
  }

  const revokedKey = result.rows[0] as any;

  // Логируем отзыв ключа
  await db.execute(sql`
    INSERT INTO audit_log (org_id, actor_type, actor_id, action, target_type, target_id, meta)
    VALUES (
      ${org.id}, 
      ${context.actorType}, 
      ${context.actorType === 'user' ? context.user?.id : context.apiKey?.keyId}, 
      'api_key_revoked', 
      'api_keys', 
      ${keyId},
      ${JSON.stringify({ name: key.name })}
    )
  `);

  return NextResponse.json({
    ok: true,
    keyId,
    name: revokedKey.name,
    revokedAt: revokedKey.revoked_at,
  });
}

export const POST = withAuthAndRBAC(handleRevoke, {
  roles: ['admin'],
});

