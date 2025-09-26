import { NextRequest, NextResponse } from "next/server";
import { withAuthAndRBAC } from "@/lib/rbac/guard";
import { db } from "@/db/client";
import { sql } from "drizzle-orm";
import crypto from "crypto";

export const runtime = 'nodejs';

async function handleGet(req: NextRequest) {
  const context = (req as any).rbacContext;
  const org = context.org;
  
  if (!org) {
    return NextResponse.json({ ok: false, error: 'Organization not found' }, { status: 400 });
  }

  const url = new URL(req.url);
  const includeRevoked = url.searchParams.get('includeRevoked') === 'true';

  let conditions = [sql`org_id = ${org.id}`];
  if (!includeRevoked) {
    conditions.push(sql`revoked_at IS NULL`);
  }

  const keys = await db.execute(sql`
    SELECT 
      id, name, scopes, rate_limit_per_min, 
      created_at, last_used_at, revoked_at
    FROM api_keys
    WHERE ${sql.join(conditions, sql` AND `)}
    ORDER BY created_at DESC
  `);

  const formattedKeys = keys.rows.map(row => {
    const r = row as any;
    return {
      id: r.id,
      name: r.name,
      scopes: r.scopes || [],
      rateLimitPerMin: r.rate_limit_per_min,
      createdAt: r.created_at,
      lastUsedAt: r.last_used_at,
      revokedAt: r.revoked_at,
      isActive: !r.revoked_at,
    };
  });

  return NextResponse.json({
    ok: true,
    org: org.slug,
    keys: formattedKeys,
  });
}

async function handlePost(req: NextRequest) {
  const context = (req as any).rbacContext;
  const org = context.org;
  
  if (!org) {
    return NextResponse.json({ ok: false, error: 'Organization not found' }, { status: 400 });
  }

  const body = await req.json();
  const { name, scopes = [], rateLimitPerMin = 120 } = body;

  if (!name) {
    return NextResponse.json({ ok: false, error: 'Name is required' }, { status: 400 });
  }

  // Генерируем API ключ
  const plainKey = `glu_${crypto.randomBytes(32).toString('hex')}`;
  const keyHash = crypto.createHash('sha256').update(plainKey).digest('hex');

  try {
    const result = await db.execute(sql`
      INSERT INTO api_keys (org_id, name, key_hash, scopes, rate_limit_per_min)
      VALUES (${org.id}, ${name}, ${keyHash}, ${scopes}, ${rateLimitPerMin})
      RETURNING id, name, scopes, rate_limit_per_min, created_at
    `);

    const newKey = result.rows[0] as any;

    // Логируем создание ключа
    await db.execute(sql`
      INSERT INTO audit_log (org_id, actor_type, actor_id, action, target_type, target_id, meta)
      VALUES (
        ${org.id}, 
        ${context.actorType}, 
        ${context.actorType === 'user' ? context.user?.id : context.apiKey?.keyId}, 
        'api_key_created', 
        'api_keys', 
        ${newKey.id},
        ${JSON.stringify({ name, scopes, rateLimitPerMin })}
      )
    `);

    return NextResponse.json({
      ok: true,
      key: {
        id: newKey.id,
        name: newKey.name,
        scopes: newKey.scopes || [],
        rateLimitPerMin: newKey.rate_limit_per_min,
        createdAt: newKey.created_at,
        // Показываем plain ключ только один раз
        plainKey,
      },
    });

  } catch (error: any) {
    if (error.code === '23505') { // Unique constraint violation
      return NextResponse.json({ ok: false, error: 'API key name already exists' }, { status: 409 });
    }
    
    console.error('API key creation error:', error);
    return NextResponse.json({ ok: false, error: 'Failed to create API key' }, { status: 500 });
  }
}

export const GET = withAuthAndRBAC(handleGet, {
  roles: ['admin', 'partner'],
});

export const POST = withAuthAndRBAC(handlePost, {
  roles: ['admin', 'partner'],
});

