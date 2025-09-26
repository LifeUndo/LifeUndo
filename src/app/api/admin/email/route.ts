import { NextRequest, NextResponse } from "next/server";
import { currentTenant } from "@/lib/tenant";
import { db } from "@/db/client";
import { sql } from "drizzle-orm";

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const tenant = await currentTenant();
    if (!tenant?.id) {
      return NextResponse.json({ ok: false, error: 'Tenant not found' }, { status: 400 });
    }

    const url = new URL(req.url);
    
    // Фильтры
    const status = url.searchParams.get('status');
    const from = url.searchParams.get('from');
    const domain = url.searchParams.get('domain');
    const hasAttachments = url.searchParams.get('hasAttachments');
    const minSize = url.searchParams.get('minSize');
    const maxSize = url.searchParams.get('maxSize');
    const days = Number(url.searchParams.get('days') || 7);
    const limit = Math.min(Number(url.searchParams.get('limit') || 50), 100);
    const offset = Number(url.searchParams.get('offset') || 0);

    // Условия WHERE
    const conditions = [sql`tenant_id = ${tenant.id}`];
    
    if (status) {
      conditions.push(sql`status = ${status}`);
    }
    
    if (from) {
      conditions.push(sql`"from" ILIKE ${'%' + from + '%'}`);
    }
    
    if (domain) {
      conditions.push(sql`EXISTS (
        SELECT 1 FROM unnest("to" || cc || bcc) AS recipient 
        WHERE recipient ILIKE ${'%@' + domain + '%'}
      )`);
    }
    
    if (hasAttachments === 'true') {
      conditions.push(sql`EXISTS (
        SELECT 1 FROM email_attachments WHERE outbox_id = email_outbox.id
      )`);
    } else if (hasAttachments === 'false') {
      conditions.push(sql`NOT EXISTS (
        SELECT 1 FROM email_attachments WHERE outbox_id = email_outbox.id
      )`);
    }

    if (minSize) {
      conditions.push(sql`(
        SELECT COALESCE(SUM(size_bytes), 0) FROM email_attachments 
        WHERE outbox_id = email_outbox.id
      ) >= ${Number(minSize) * 1024 * 1024}`);
    }
    
    if (maxSize) {
      conditions.push(sql`(
        SELECT COALESCE(SUM(size_bytes), 0) FROM email_attachments 
        WHERE outbox_id = email_outbox.id
      ) <= ${Number(maxSize) * 1024 * 1024}`);
    }

    // Временной фильтр
    const fromDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    conditions.push(sql`created_at >= ${fromDate.toISOString()}`);

    // Запрос
    const emails = await db.execute(sql`
      SELECT 
        e.id,
        e.created_at,
        e."from",
        e."to",
        e.cc,
        e.bcc,
        e.subject,
        e.status,
        e.hold_reason,
        e.expires_at,
        e.approved_by,
        e.approved_at,
        e.denied_by,
        e.denied_at,
        e.relay_attempts,
        e.last_error,
        e.message_id,
        COALESCE(
          (SELECT SUM(size_bytes) FROM email_attachments WHERE outbox_id = e.id), 
          0
        ) as total_size_bytes,
        (
          SELECT COUNT(*) FROM email_attachments WHERE outbox_id = e.id
        ) as attachment_count
      FROM email_outbox e
      WHERE ${sql.join(conditions, sql` AND `)}
      ORDER BY e.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `);

    // Общее количество для пагинации
    const countResult = await db.execute(sql`
      SELECT COUNT(*) as total
      FROM email_outbox e
      WHERE ${sql.join(conditions, sql` AND `)}
    `);

    const total = Number((countResult.rows[0] as any).total);

    // Форматирование ответа
    const formattedEmails = emails.rows.map(row => {
      const r = row as any;
      return {
        id: r.id,
        createdAt: r.created_at,
        from: r.from,
        to: r.to,
        cc: r.cc || [],
        bcc: r.bcc || [],
        subject: r.subject,
        status: r.status,
        holdReason: r.hold_reason,
        expiresAt: r.expires_at,
        approvedBy: r.approved_by,
        approvedAt: r.approved_at,
        deniedBy: r.denied_by,
        deniedAt: r.denied_at,
        relayAttempts: r.relay_attempts,
        lastError: r.last_error,
        messageId: r.message_id,
        totalSizeBytes: Number(r.total_size_bytes || 0),
        attachmentCount: Number(r.attachment_count || 0),
        recipientCount: r.to.length + (r.cc || []).length + (r.bcc || []).length,
      };
    });

    return NextResponse.json({
      ok: true,
      tenant: tenant.slug,
      emails: formattedEmails,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
      filters: {
        status,
        from,
        domain,
        hasAttachments,
        minSize,
        maxSize,
        days,
      },
    });

  } catch (error) {
    console.error('Email list error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

