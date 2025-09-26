import { NextRequest, NextResponse } from "next/server";
import { withAuthAndRBAC } from "@/lib/rbac/guard";
import { db } from "@/db/client";
import { sql } from "drizzle-orm";
import { EmailRelayService } from "@/cron/email-relay";

export const runtime = 'nodejs';

async function handleForceSend(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const context = (req as any).rbacContext;
  const org = context.org;
  const emailId = params.id;
  
  if (!org) {
    return NextResponse.json({ ok: false, error: 'Organization not found' }, { status: 400 });
  }

  // Проверяем существование письма и его статус
  const emailCheck = await db.execute(sql`
    SELECT id, status, relay_attempts, relay_error_message
    FROM email_outbox
    WHERE id = ${emailId} AND org_id = ${org.id}
  `);

  if (emailCheck.rows.length === 0) {
    return NextResponse.json({ ok: false, error: 'Email not found' }, { status: 404 });
  }

  const email = emailCheck.rows[0] as any;

  // Проверяем, можно ли отправить письмо
  if (email.status === 'SENT') {
    return NextResponse.json({ 
      ok: false, 
      error: 'Email already sent successfully' 
    }, { status: 400 });
  }

  if (email.status === 'DENIED') {
    return NextResponse.json({ 
      ok: false, 
      error: 'Cannot force send denied email' 
    }, { status: 400 });
  }

  try {
    // Создаем экземпляр EmailRelayService
    const relayConfig = {
      host: process.env.EMAIL_RELAY_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_RELAY_PORT || 587),
      user: process.env.EMAIL_RELAY_USER || '',
      pass: process.env.EMAIL_RELAY_PASS || '',
      secure: process.env.EMAIL_RELAY_TLS === 'true',
      maxAttempts: Number(process.env.EMAIL_RELAY_MAX_ATTEMPTS || 5),
      backoffSeconds: (process.env.EMAIL_RELAY_BACKOFF || '60,300,900,3600')
        .split(',').map(s => Number(s.trim())),
    };

    if (!relayConfig.user || !relayConfig.pass) {
      return NextResponse.json({ 
        ok: false, 
        error: 'SMTP Relay not configured' 
      }, { status: 500 });
    }

    const relayService = new EmailRelayService(relayConfig);

    // Принудительная отправка
    const result = await relayService.forceSendEmail(emailId);

    // Логируем действие в audit_log
    try {
      await db.execute(sql`
        INSERT INTO audit_log (org_id, actor_type, actor_id, action, target_type, target_id, meta)
        VALUES (
          ${org.id}, 
          ${context.actorType}, 
          ${context.actorType === 'user' ? context.user?.id : context.apiKey?.keyId}, 
          'email_force_send', 
          'email_outbox', 
          ${emailId},
          ${JSON.stringify({ 
            emailId, 
            result,
            previousAttempts: email.relay_attempts,
            previousError: email.relay_error_message 
          })}
        )
      `);
    } catch (auditError) {
      console.warn('Failed to log email force send:', auditError);
    }

    return NextResponse.json({
      ok: true,
      emailId,
      result,
      message: result === 'SENT' ? 'Email sent successfully' : 'Email send failed',
    });

  } catch (error: any) {
    console.error(`Failed to force send email ${emailId}:`, error);

    // Логируем ошибку
    try {
      await db.execute(sql`
        INSERT INTO audit_log (org_id, actor_type, actor_id, action, target_type, target_id, meta)
        VALUES (
          ${org.id}, 
          ${context.actorType}, 
          ${context.actorType === 'user' ? context.user?.id : context.apiKey?.keyId}, 
          'email_force_send_error', 
          'email_outbox', 
          ${emailId},
          ${JSON.stringify({ 
            emailId, 
            error: error.message,
            previousAttempts: email.relay_attempts 
          })}
        )
      `);
    } catch (auditError) {
      console.warn('Failed to log email force send error:', auditError);
    }

    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to send email',
      details: error.message 
    }, { status: 500 });
  }
}

export const POST = withAuthAndRBAC(handleForceSend, {
  roles: ['admin', 'operator'],
});

