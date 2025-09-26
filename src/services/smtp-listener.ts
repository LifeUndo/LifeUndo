import { SMTPServer } from 'smtp-server';
import { simpleParser } from 'mailparser';
import { db } from '@/db/client';
import { sql } from 'drizzle-orm';
import { evaluateEmailRules } from '@/lib/email-rules';
import crypto from 'crypto';

export interface SMTPListenerConfig {
  port: number;
  host: string;
  maxSize: number;
  defaultOrgId: string;
}

export class EmailSMTPListener {
  private server: SMTPServer;
  private config: SMTPListenerConfig;

  constructor(config: SMTPListenerConfig) {
    this.config = config;
    this.server = new SMTPServer({
      banner: 'GLU Email Pause Gateway',
      size: config.maxSize,
      disabledCommands: ['STARTTLS'], // Для демо отключаем TLS
      onConnect: this.onConnect.bind(this),
      onMailFrom: this.onMailFrom.bind(this),
      onRcptTo: this.onRcptTo.bind(this),
      onData: this.onData.bind(this),
    });
  }

  private onConnect(session: any, callback: (err?: Error) => void) {
    console.log(`SMTP connection from ${session.remoteAddress}`);
    callback(); // Accept all connections for now
  }

  private onMailFrom(address: any, session: any, callback: (err?: Error) => void) {
    console.log(`MAIL FROM: ${address.address}`);
    session.envelope = session.envelope || {};
    session.envelope.mailFrom = address.address;
    callback();
  }

  private onRcptTo(address: any, session: any, callback: (err?: Error) => void) {
    console.log(`RCPT TO: ${address.address}`);
    session.envelope = session.envelope || {};
    session.envelope.rcptTo = session.envelope.rcptTo || [];
    session.envelope.rcptTo.push(address.address);
    callback();
  }

  private async onData(stream: any, session: any, callback: (err?: Error) => void) {
    try {
      console.log('DATA received, parsing...');
      
      // Парсим MIME сообщение
      const parsed = await simpleParser(stream);
      
      // Извлекаем данные
      const from = session.envelope.mailFrom;
      const to = session.envelope.rcptTo || [];
      const subject = parsed.subject || 'No Subject';
      const text = parsed.text || '';
      const html = parsed.html || '';
      
      console.log(`Parsed email: ${from} -> ${to.join(', ')} : ${subject}`);

      // Проверяем размер
      const totalSize = Buffer.byteLength(text) + Buffer.byteLength(html) + 
        (parsed.attachments?.reduce((sum, att) => sum + (att.content?.length || 0), 0) || 0);
      
      if (totalSize > this.config.maxSize) {
        console.log(`Email too large: ${totalSize} bytes`);
        return callback(new Error(`552 Message size exceeds maximum allowed size`));
      }

      // Генерируем fingerprint для дедупликации
      const fingerprint = crypto.createHash('sha256').update(
        JSON.stringify({ from, to: to.sort(), subject, text, html })
      ).digest('hex');

      // Проверяем дубликаты
      const existing = await db.execute(sql`
        SELECT id, status FROM email_outbox 
        WHERE fingerprint = ${fingerprint} AND org_id = ${this.config.defaultOrgId}
        LIMIT 1
      `);

      if (existing.rows.length > 0) {
        const existingEmail = existing.rows[0] as any;
        console.log(`Duplicate email found: ${existingEmail.id}, status: ${existingEmail.status}`);
        return callback(new Error(`250 Queued as ${existingEmail.id}`));
      }

      // Оценка правил
      const emailMessage = {
        from,
        to,
        cc: parsed.cc?.map((cc: any) => cc.address) || [],
        bcc: parsed.bcc?.map((bcc: any) => bcc.address) || [],
        subject,
        textContent: text,
        htmlContent: html,
        attachments: parsed.attachments?.map(att => ({
          filename: att.filename || 'attachment',
          mimeType: att.contentType || 'application/octet-stream',
          sizeBytes: att.content?.length || 0,
        })) || [],
      };

      const ruleResult = await evaluateEmailRules(this.config.defaultOrgId, emailMessage);

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
          org_id, "from", "to", cc, bcc, subject, text_content, html_content,
          status, hold_reason, expires_at, message_id, fingerprint
        ) VALUES (
          ${this.config.defaultOrgId}, ${from}, ${to}, 
          ${emailMessage.cc}, ${emailMessage.bcc}, 
          ${subject}, ${text}, ${html},
          ${status}, ${holdReason}, ${expiresAt?.toISOString() || null}, 
          ${parsed.messageId || `<${crypto.randomUUID()}@${process.env.EMAIL_DOMAIN || 'lifeundo.com'}>`}, 
          ${fingerprint}
        ) RETURNING id
      `);

      const outboxId = (outboxResult.rows[0] as any).id;

      // Сохранение вложений
      if (parsed.attachments && parsed.attachments.length > 0) {
        for (const attachment of parsed.attachments) {
          const storageKey = `attachments/${this.config.defaultOrgId}/${outboxId}/${attachment.filename || 'attachment'}`;
          
          await db.execute(sql`
            INSERT INTO email_attachments (
              outbox_id, filename, mime_type, size_bytes, storage_key
            ) VALUES (
              ${outboxId}, ${attachment.filename || 'attachment'}, 
              ${attachment.contentType || 'application/octet-stream'}, 
              ${attachment.content?.length || 0}, ${storageKey}
            )
          `);
        }
      }

      console.log(`Email queued: ${outboxId}, status: ${status}`);
      
      if (status === 'DENIED') {
        return callback(new Error(`550 Denied: ${holdReason}`));
      } else {
        return callback(new Error(`250 Queued as ${outboxId}`));
      }

    } catch (error: any) {
      console.error('SMTP DATA processing error:', error);
      return callback(new Error(`451 Temporary failure: ${error.message}`));
    }
  }

  public start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.listen(this.config.port, this.config.host, (error) => {
        if (error) {
          console.error('SMTP Server failed to start:', error);
          reject(error);
        } else {
          console.log(`SMTP Listener started on ${this.config.host}:${this.config.port}`);
          resolve();
        }
      });
    });
  }

  public stop(): Promise<void> {
    return new Promise((resolve) => {
      this.server.close(() => {
        console.log('SMTP Listener stopped');
        resolve();
      });
    });
  }
}

// Запуск сервера (если файл запускается напрямую)
if (require.main === module) {
  const config: SMTPListenerConfig = {
    port: Number(process.env.EMAIL_SMTP_LISTEN_PORT || 2525),
    host: process.env.EMAIL_SMTP_LISTEN_HOST || '0.0.0.0',
    maxSize: Number(process.env.EMAIL_MAX_SIZE_MB || 25) * 1024 * 1024,
    defaultOrgId: process.env.DEFAULT_ORG_ID || '00000000-0000-0000-0000-000000000001',
  };

  const listener = new EmailSMTPListener(config);
  
  listener.start().catch((error) => {
    console.error('Failed to start SMTP listener:', error);
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('Shutting down SMTP listener...');
    listener.stop().then(() => process.exit(0));
  });

  process.on('SIGTERM', () => {
    console.log('Shutting down SMTP listener...');
    listener.stop().then(() => process.exit(0));
  });
}

