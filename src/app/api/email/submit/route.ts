import { NextRequest, NextResponse } from "next/server";
import { currentTenant } from "@/lib/tenant";
import { db } from "@/db/client";
import { sql } from "drizzle-orm";
import { evaluateEmailRules, EmailMessage } from "@/lib/email-rules";
import crypto from "crypto";

export const runtime = 'nodejs';

interface EmailSubmitRequest {
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    mimeType: string;
    sizeBytes: number;
    data: string; // base64 encoded
  }>;
}

function generateFingerprint(message: EmailSubmitRequest): string {
  const content = JSON.stringify({
    from: message.from,
    to: message.to.sort(),
    cc: (message.cc || []).sort(),
    bcc: (message.bcc || []).sort(),
    subject: message.subject,
    text: message.text,
    html: message.html,
    attachments: (message.attachments || []).map(a => ({
      filename: a.filename,
      mimeType: a.mimeType,
      sizeBytes: a.sizeBytes,
    })).sort((a, b) => a.filename.localeCompare(b.filename)),
  });
  
  return crypto.createHash('sha256').update(content).digest('hex');
}

function generateMessageId(): string {
  return `<${crypto.randomUUID()}@${process.env.EMAIL_DOMAIN || 'lifeundo.com'}>`;
}

export async function POST(req: NextRequest) {
  try {
    const tenant = await currentTenant();
    if (!tenant?.id) {
      return NextResponse.json({ ok: false, error: 'Tenant not found' }, { status: 400 });
    }

    const body: EmailSubmitRequest = await req.json();

    // Валидация
    if (!body.from || !body.to || body.to.length === 0 || !body.subject) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Missing required fields: from, to, subject' 
      }, { status: 400 });
    }

    // Проверка лимитов
    const maxSize = Number(process.env.EMAIL_MAX_SIZE_MB || 25) * 1024 * 1024;
    const totalSize = (body.attachments || []).reduce((sum, att) => sum + att.sizeBytes, 0);
    if (totalSize > maxSize) {
      return NextResponse.json({ 
        ok: false, 
        error: `Email too large: ${Math.round(totalSize / 1024 / 1024)}MB > ${process.env.EMAIL_MAX_SIZE_MB || 25}MB` 
      }, { status: 413 });
    }

    const fingerprint = generateFingerprint(body);
    const messageId = generateMessageId();

    // Проверка дубликатов
    const existing = await db.execute(sql`
      SELECT id, status FROM email_outbox 
      WHERE fingerprint = ${fingerprint} AND tenant_id = ${tenant.id}
      LIMIT 1
    `);

    if (existing.rows.length > 0) {
      const existingEmail = existing.rows[0] as any;
      return NextResponse.json({
        ok: true,
        outboxId: existingEmail.id,
        status: existingEmail.status,
        duplicate: true,
      });
    }

    // Оценка правил
    const emailMessage: EmailMessage = {
      from: body.from,
      to: body.to,
      cc: body.cc,
      bcc: body.bcc,
      subject: body.subject,
      textContent: body.text,
      htmlContent: body.html,
      attachments: body.attachments?.map(att => ({
        filename: att.filename,
        mimeType: att.mimeType,
        sizeBytes: att.sizeBytes,
      })),
    };

    const ruleResult = await evaluateEmailRules(tenant.id.toString(), emailMessage);

    // Определяем статус и TTL
    let status: 'HOLD' | 'APPROVED' | 'DENIED';
    let holdReason: string | null = null;
    let expiresAt: Date | null = null;

    if (ruleResult.action === 'AUTO_DENY') {
      status = 'DENIED';
      holdReason = ruleResult.reason;
    } else if (ruleResult.action === 'AUTO_ALLOW') {
      status = 'APPROVED';
    } else {
      status = 'HOLD';
      holdReason = ruleResult.reason || 'Manual review required';
      
      const ttlMinutes = Number(process.env.EMAIL_HOLD_TTL_MINUTES || 60);
      expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);
    }

    // Создание записи в outbox
    const outboxResult = await db.execute(sql`
      INSERT INTO email_outbox (
        tenant_id, "from", "to", cc, bcc, subject, text_content, html_content,
        status, hold_reason, expires_at, message_id, fingerprint
      ) VALUES (
        ${tenant.id}, ${body.from}, ${body.to}, ${body.cc || []}, ${body.bcc || []}, 
        ${body.subject}, ${body.text || null}, ${body.html || null},
        ${status}, ${holdReason}, ${expiresAt?.toISOString() || null}, ${messageId}, ${fingerprint}
      ) RETURNING id
    `);

    const outboxId = (outboxResult.rows[0] as any).id;

    // Сохранение вложений
    if (body.attachments && body.attachments.length > 0) {
      for (const attachment of body.attachments) {
        const storageKey = `attachments/${tenant.id}/${outboxId}/${attachment.filename}`;
        
        // В реальном проекте здесь бы сохранялся файл в blob storage
        // Для демо просто записываем метаданные
        
        await db.execute(sql`
          INSERT INTO email_attachments (
            outbox_id, filename, mime_type, size_bytes, storage_key
          ) VALUES (
            ${outboxId}, ${attachment.filename}, ${attachment.mimeType}, ${attachment.sizeBytes}, ${storageKey}
          )
        `);
      }
    }

    return NextResponse.json({
      ok: true,
      outboxId,
      status,
      holdReason,
      expiresAt: expiresAt?.toISOString(),
      ruleMatched: ruleResult.matched,
      ruleName: ruleResult.rule?.name,
    });

  } catch (error) {
    console.error('Email submit error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

