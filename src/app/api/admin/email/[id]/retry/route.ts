import { NextRequest, NextResponse } from "next/server";
import { withAuthAndRBAC } from "@/lib/rbac/guard";
import { db } from "@/db/client";
import { sql } from "drizzle-orm";

export const runtime = 'nodejs';

async function handleRetry(
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

  // Проверяем, можно ли повторить отправку
  if (email.status === 'SENT') {
    return NextResponse.json({ 
      ok: false, 
      error: 'Email already sent successfully' 
    }, { status: 400 });
  }

  if (email.status === 'DENIED') {
    return NextResponse.json({ 
      ok: false, 
      error: 'Cannot retry denied email' 
    }, { status: 400 });
  }

  const maxAttempts = Number(process.env.EMAIL_RELAY_MAX_ATTEMPTS || 5);
  if (email.relay_attempts >= maxAttempts) {
    return NextResponse.json({ 
      ok: false, 
      error: `Maximum retry attempts (${maxAttempts}) exceeded` 
    }, { status: 400 });
  }

  // Сбрасываем статус на APPROVED для повторной отправки
  const result = await db.execute(sql`
    UPDATE email_outbox 
    SET 
      status = 'APPROVED',
      relay_next_attempt_at = now(),
      relay_error_message = NULL,
      updated_at = now()
    WHERE id = ${emailId} AND org_id = ${org.id}
    RETURNING id, status, relay_attempts
  `);

  if (result.rows.length === 0) {
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to update email status' 
    }, { status: 500 });
  }

  const updatedEmail = result.rows[0] as any;

  // Логируем действие в audit_log
  try {
    await db.execute(sql`
      INSERT INTO audit_log (org_id, actor_type, actor_id, action, target_type, target_id, meta)
      VALUES (
        ${org.id}, 
        ${context.actorType}, 
        ${context.actorType === 'user' ? context.user?.id : context.apiKey?.keyId}, 
        'email_retry', 
        'email_outbox', 
        ${emailId},
        ${JSON.stringify({ 
          emailId, 
          status: 'APPROVED', 
          previousAttempts: email.relay_attempts,
          previousError: email.relay_error_message 
        })}
      )
    `);
  } catch (auditError) {
    console.warn('Failed to log email retry:', auditError);
  }

  return NextResponse.json({
    ok: true,
    emailId,
    status: updatedEmail.status,
    relayAttempts: updatedEmail.relay_attempts,
    message: 'Email queued for retry',
  });
}

export const POST = withAuthAndRBAC(handleRetry, {
  roles: ['admin', 'operator'],
});

