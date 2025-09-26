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

  const webhooks = await db.execute(sql`
    SELECT 
      id, url, events, is_active, created_at, updated_at,
      last_delivery_at, last_delivery_status, last_delivery_error
    FROM webhooks
    WHERE org_id = ${org.id}
    ORDER BY created_at DESC
  `);

  const formattedWebhooks = webhooks.rows.map(row => {
    const r = row as any;
    return {
      id: r.id,
      url: r.url,
      events: r.events || [],
      isActive: r.is_active,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      lastDeliveryAt: r.last_delivery_at,
      lastDeliveryStatus: r.last_delivery_status,
      lastDeliveryError: r.last_delivery_error,
    };
  });

  return NextResponse.json({
    ok: true,
    org: org.slug,
    webhooks: formattedWebhooks,
  });
}

async function handlePost(req: NextRequest) {
  const context = (req as any).rbacContext;
  const org = context.org;
  
  if (!org) {
    return NextResponse.json({ ok: false, error: 'Organization not found' }, { status: 400 });
  }

  const body = await req.json();
  const { url, events = [], isActive = true } = body;

  if (!url) {
    return NextResponse.json({ ok: false, error: 'URL is required' }, { status: 400 });
  }

  // Валидация URL
  try {
    new URL(url);
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid URL format' }, { status: 400 });
  }

  // Генерируем секрет для подписи
  const secret = crypto.randomBytes(32).toString('hex');

  try {
    const result = await db.execute(sql`
      INSERT INTO webhooks (org_id, url, secret, events, is_active)
      VALUES (${org.id}, ${url}, ${secret}, ${events}, ${isActive})
      RETURNING id, url, events, is_active, created_at
    `);

    const newWebhook = result.rows[0] as any;

    // Логируем создание webhook
    await db.execute(sql`
      INSERT INTO audit_log (org_id, actor_type, actor_id, action, target_type, target_id, meta)
      VALUES (
        ${org.id}, 
        ${context.actorType}, 
        ${context.actorType === 'user' ? context.user?.id : context.apiKey?.keyId}, 
        'webhook_created', 
        'webhooks', 
        ${newWebhook.id},
        ${JSON.stringify({ url, events, isActive })}
      )
    `);

    return NextResponse.json({
      ok: true,
      webhook: {
        id: newWebhook.id,
        url: newWebhook.url,
        events: newWebhook.events || [],
        isActive: newWebhook.is_active,
        createdAt: newWebhook.created_at,
        // Секрет показываем только один раз
        secret,
      },
    });

  } catch (error) {
    console.error('Webhook creation error:', error);
    return NextResponse.json({ ok: false, error: 'Failed to create webhook' }, { status: 500 });
  }
}

export const GET = withAuthAndRBAC(handleGet, {
  roles: ['admin', 'partner'],
});

export const POST = withAuthAndRBAC(handlePost, {
  roles: ['admin', 'partner'],
});

