import { NextRequest, NextResponse } from "next/server";
import { withAuthAndRBAC } from "@/lib/rbac/guard";
import { db } from "@/db/client";
import { sql } from "drizzle-orm";
import crypto from "crypto";

export const runtime = 'nodejs';

async function handleTest(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const context = (req as any).rbacContext;
  const org = context.org;
  const webhookId = params.id;
  
  if (!org) {
    return NextResponse.json({ ok: false, error: 'Organization not found' }, { status: 400 });
  }

  // Получаем webhook
  const webhookResult = await db.execute(sql`
    SELECT id, url, secret, events, is_active
    FROM webhooks
    WHERE id = ${webhookId} AND org_id = ${org.id}
  `);

  if (webhookResult.rows.length === 0) {
    return NextResponse.json({ ok: false, error: 'Webhook not found' }, { status: 404 });
  }

  const webhook = webhookResult.rows[0] as any;

  if (!webhook.is_active) {
    return NextResponse.json({ ok: false, error: 'Webhook is disabled' }, { status: 400 });
  }

  // Создаем тестовое событие
  const testEvent = {
    id: crypto.randomUUID(),
    type: 'webhook.test',
    timestamp: new Date().toISOString(),
    org: {
      id: org.id,
      slug: org.slug,
    },
    data: {
      message: 'Test webhook delivery',
      testId: crypto.randomUUID(),
    },
  };

  const payload = JSON.stringify(testEvent);
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = crypto
    .createHmac('sha256', webhook.secret)
    .update(payload + timestamp)
    .digest('hex');

  try {
    // Отправляем webhook
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-GLU-Signature': signature,
        'X-GLU-Timestamp': timestamp,
        'X-GLU-Event': 'webhook.test',
        'User-Agent': 'GLU-Webhook/1.0',
      },
      body: payload,
      signal: AbortSignal.timeout(10000), // 10s timeout
    });

    const success = response.ok;
    const status = response.status;
    const responseText = await response.text().catch(() => 'Failed to read response');

    // Обновляем статус доставки
    await db.execute(sql`
      UPDATE webhooks 
      SET 
        last_delivery_at = now(),
        last_delivery_status = ${status.toString()},
        last_delivery_error = ${success ? null : responseText.slice(0, 500)}
      WHERE id = ${webhookId}
    `);

    // Логируем тест
    await db.execute(sql`
      INSERT INTO audit_log (org_id, actor_type, actor_id, action, target_type, target_id, meta)
      VALUES (
        ${org.id}, 
        ${context.actorType}, 
        ${context.actorType === 'user' ? context.user?.id : context.apiKey?.keyId}, 
        'webhook_test', 
        'webhooks', 
        ${webhookId},
        ${JSON.stringify({ success, status, responseLength: responseText.length })}
      )
    `);

    return NextResponse.json({
      ok: true,
      webhookId,
      success,
      status,
      response: responseText.slice(0, 1000), // Ограничиваем размер ответа
      signature,
      timestamp,
    });

  } catch (error: any) {
    const errorMessage = error.message || 'Unknown error';
    
    // Обновляем статус ошибки
    await db.execute(sql`
      UPDATE webhooks 
      SET 
        last_delivery_at = now(),
        last_delivery_status = 'ERROR',
        last_delivery_error = ${errorMessage.slice(0, 500)}
      WHERE id = ${webhookId}
    `);

    return NextResponse.json({
      ok: false,
      error: 'Webhook delivery failed',
      details: errorMessage,
    }, { status: 500 });
  }
}

export const POST = withAuthAndRBAC(handleTest, {
  roles: ['admin', 'partner'],
});

