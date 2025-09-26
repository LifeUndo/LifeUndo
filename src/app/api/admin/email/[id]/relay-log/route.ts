import { NextRequest, NextResponse } from "next/server";
import { withAuthAndRBAC } from "@/lib/rbac/guard";
import { db } from "@/db/client";
import { sql } from "drizzle-orm";

export const runtime = 'nodejs';

async function handleGetRelayLog(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const context = (req as any).rbacContext;
  const org = context.org;
  const emailId = params.id;
  
  if (!org) {
    return NextResponse.json({ ok: false, error: 'Organization not found' }, { status: 400 });
  }

  // Проверяем существование письма и принадлежность к организации
  const emailCheck = await db.execute(sql`
    SELECT id, status, "from", subject, created_at
    FROM email_outbox
    WHERE id = ${emailId} AND org_id = ${org.id}
  `);

  if (emailCheck.rows.length === 0) {
    return NextResponse.json({ ok: false, error: 'Email not found' }, { status: 404 });
  }

  const email = emailCheck.rows[0] as any;

  // Получаем историю попыток релэя
  const relayLogs = await db.execute(sql`
    SELECT 
      id, relay_host, relay_status, response_code, response_message,
      attempted_at, created_at
    FROM email_relay_log
    WHERE outbox_id = ${emailId}
    ORDER BY attempted_at DESC
  `);

  // Получаем статистику по письму
  const statsResult = await db.execute(sql`
    SELECT 
      COUNT(*) as total_attempts,
      COUNT(*) FILTER (WHERE relay_status = 'SENT') as sent_count,
      COUNT(*) FILTER (WHERE relay_status = 'FAILED') as failed_count,
      COUNT(*) FILTER (WHERE relay_status = 'RETRY') as retry_count,
      MAX(attempted_at) as last_attempt_at,
      MIN(attempted_at) as first_attempt_at
    FROM email_relay_log
    WHERE outbox_id = ${emailId}
  `);

  const stats = statsResult.rows[0] as any;

  const formattedLogs = relayLogs.rows.map(row => {
    const r = row as any;
    return {
      id: r.id,
      relayHost: r.relay_host,
      status: r.relay_status,
      responseCode: r.response_code,
      responseMessage: r.response_message,
      attemptedAt: r.attempted_at,
      createdAt: r.created_at,
    };
  });

  return NextResponse.json({
    ok: true,
    email: {
      id: email.id,
      status: email.status,
      from: email.from,
      subject: email.subject,
      createdAt: email.created_at,
    },
    relayLogs: formattedLogs,
    stats: {
      totalAttempts: Number(stats.total_attempts || 0),
      sentCount: Number(stats.sent_count || 0),
      failedCount: Number(stats.failed_count || 0),
      retryCount: Number(stats.retry_count || 0),
      lastAttemptAt: stats.last_attempt_at,
      firstAttemptAt: stats.first_attempt_at,
      successRate: stats.total_attempts > 0 ? 
        Math.round((Number(stats.sent_count) / Number(stats.total_attempts)) * 100) : 0,
    },
  });
}

export const GET = withAuthAndRBAC(handleGetRelayLog, {
  roles: ['admin', 'operator', 'auditor', 'partner'],
});

