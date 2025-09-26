import nodemailer from 'nodemailer';
import { db } from '@/db/client';
import { sql } from 'drizzle-orm';

export interface RelayConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  secure: boolean;
  maxAttempts: number;
  backoffSeconds: number[];
}

export interface RelayStats {
  processed: number;
  sent: number;
  failed: number;
  retried: number;
  errors: string[];
}

export class EmailRelayService {
  private config: RelayConfig;
  private transporter: nodemailer.Transporter | null = null;

  constructor(config: RelayConfig) {
    this.config = config;
  }

  private async getTransporter(): Promise<nodemailer.Transporter> {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: this.config.host,
        port: this.config.port,
        secure: this.config.secure,
        auth: {
          user: this.config.user,
          pass: this.config.pass,
        },
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
      });

      // Проверяем соединение
      try {
        await this.transporter.verify();
        console.log('SMTP Relay connection verified');
      } catch (error) {
        console.error('SMTP Relay connection failed:', error);
        throw error;
      }
    }

    return this.transporter;
  }

  private getBackoffDelay(attemptNumber: number): number {
    const backoffIndex = Math.min(attemptNumber - 1, this.config.backoffSeconds.length - 1);
    return this.config.backoffSeconds[backoffIndex] * 1000; // Convert to milliseconds
  }

  private async logRelayAttempt(
    outboxId: string,
    status: 'SENT' | 'FAILED' | 'RETRY',
    responseCode?: number,
    responseMessage?: string,
    error?: string
  ): Promise<void> {
    try {
      await db.execute(sql`
        INSERT INTO email_relay_log (
          outbox_id, relay_host, relay_status, response_code, response_message
        ) VALUES (
          ${outboxId}, ${this.config.host}, ${status}, 
          ${responseCode || null}, ${responseMessage || error || null}
        )
      `);
    } catch (error) {
      console.error('Failed to log relay attempt:', error);
    }
  }

  private async sendSingleEmail(email: any): Promise<'SENT' | 'FAILED' | 'RETRY'> {
    try {
      const transporter = await this.getTransporter();

      // Подготавливаем attachments
      const attachments = await this.getAttachments(email.id);

      const mailOptions = {
        from: email.from,
        to: email.to.join(', '),
        cc: email.cc?.length ? email.cc.join(', ') : undefined,
        bcc: email.bcc?.length ? email.bcc.join(', ') : undefined,
        subject: email.subject,
        text: email.text_content,
        html: email.html_content,
        attachments: attachments.map(att => ({
          filename: att.filename,
          content: Buffer.from(''), // В реальном проекте здесь был бы контент из blob storage
          contentType: att.mime_type,
        })),
        messageId: email.message_id,
      };

      const result = await transporter.sendMail(mailOptions);
      
      // Обновляем статус на SENT
      await db.execute(sql`
        UPDATE email_outbox 
        SET 
          status = 'SENT',
          relay_message_id = ${result.messageId},
          relay_last_attempt_at = now(),
          relay_attempts = relay_attempts + 1,
          relay_error_message = NULL
        WHERE id = ${email.id}
      `);

      await this.logRelayAttempt(email.id, 'SENT', 250, result.messageId);
      
      console.log(`Email sent successfully: ${email.id} -> ${result.messageId}`);
      return 'SENT';

    } catch (error: any) {
      console.error(`Failed to send email ${email.id}:`, error);
      
      const shouldRetry = email.relay_attempts < this.config.maxAttempts;
      const status = shouldRetry ? 'RETRY' : 'FAILED';
      
      // Обновляем статус
      await db.execute(sql`
        UPDATE email_outbox 
        SET 
          status = ${status === 'RETRY' ? 'APPROVED' : 'FAILED'},
          relay_last_attempt_at = now(),
          relay_attempts = relay_attempts + 1,
          relay_error_message = ${error.message},
          relay_next_attempt_at = ${status === 'RETRY' ? 
            `now() + interval '${this.getBackoffDelay(email.relay_attempts + 1)} milliseconds'` : 
            'NULL'
          }
        WHERE id = ${email.id}
      `);

      const responseCode = error.responseCode || 500;
      const responseMessage = error.response || error.message;
      
      await this.logRelayAttempt(email.id, status, responseCode, responseMessage, error.message);
      
      return status;
    }
  }

  private async getAttachments(outboxId: string): Promise<any[]> {
    try {
      const result = await db.execute(sql`
        SELECT filename, mime_type, size_bytes, storage_key
        FROM email_attachments
        WHERE outbox_id = ${outboxId}
      `);
      
      return result.rows.map(row => row as any);
    } catch (error) {
      console.error('Failed to get attachments:', error);
      return [];
    }
  }

  public async processPendingEmails(batchSize: number = 10): Promise<RelayStats> {
    const stats: RelayStats = {
      processed: 0,
      sent: 0,
      failed: 0,
      retried: 0,
      errors: [],
    };

    try {
      // Получаем письма готовые к отправке
      const emails = await db.execute(sql`
        SELECT 
          id, "from", "to", cc, bcc, subject, text_content, html_content,
          message_id, relay_attempts, relay_last_attempt_at
        FROM email_outbox
        WHERE status = 'APPROVED' 
          AND (relay_next_attempt_at IS NULL OR relay_next_attempt_at <= now())
          AND relay_attempts < ${this.config.maxAttempts}
        ORDER BY created_at ASC
        LIMIT ${batchSize}
      `);

      console.log(`Processing ${emails.rows.length} emails for relay`);

      for (const email of emails.rows) {
        try {
          const result = await this.sendSingleEmail(email);
          stats.processed++;
          
          switch (result) {
            case 'SENT':
              stats.sent++;
              break;
            case 'FAILED':
              stats.failed++;
              break;
            case 'RETRY':
              stats.retried++;
              break;
          }

          // Небольшая задержка между отправками
          await new Promise(resolve => setTimeout(resolve, 100));

        } catch (error: any) {
          stats.errors.push(`Email ${(email as any).id}: ${error.message}`);
          console.error(`Error processing email ${(email as any).id}:`, error);
        }
      }

      console.log(`Relay batch completed: ${JSON.stringify(stats)}`);

    } catch (error: any) {
      console.error('Failed to process pending emails:', error);
      stats.errors.push(`Batch error: ${error.message}`);
    }

    return stats;
  }

  public async forceSendEmail(outboxId: string): Promise<'SENT' | 'FAILED'> {
    try {
      const emailResult = await db.execute(sql`
        SELECT 
          id, "from", "to", cc, bcc, subject, text_content, html_content,
          message_id, relay_attempts
        FROM email_outbox
        WHERE id = ${outboxId}
        LIMIT 1
      `);

      if (emailResult.rows.length === 0) {
        throw new Error('Email not found');
      }

      const email = emailResult.rows[0] as any;
      const result = await this.sendSingleEmail(email);
      
      return result === 'SENT' ? 'SENT' : 'FAILED';

    } catch (error: any) {
      console.error(`Failed to force send email ${outboxId}:`, error);
      return 'FAILED';
    }
  }

  public async getRelayStats(orgId: string, days: number = 7): Promise<any> {
    try {
      const result = await db.execute(sql`
        SELECT * FROM get_relay_stats(${orgId}, ${days})
      `);
      
      return result.rows[0] as any;
    } catch (error) {
      console.error('Failed to get relay stats:', error);
      return {
        total_attempts: 0,
        sent_count: 0,
        failed_count: 0,
        retry_count: 0,
        success_rate: 0,
      };
    }
  }
}

// Cron job функция
export async function runEmailRelayCron(): Promise<void> {
  const config: RelayConfig = {
    host: process.env.EMAIL_RELAY_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_RELAY_PORT || 587),
    user: process.env.EMAIL_RELAY_USER || '',
    pass: process.env.EMAIL_RELAY_PASS || '',
    secure: process.env.EMAIL_RELAY_TLS === 'true',
    maxAttempts: Number(process.env.EMAIL_RELAY_MAX_ATTEMPTS || 5),
    backoffSeconds: (process.env.EMAIL_RELAY_BACKOFF || '60,300,900,3600')
      .split(',').map(s => Number(s.trim())),
  };

  if (!config.user || !config.pass) {
    console.warn('SMTP Relay not configured (missing EMAIL_RELAY_USER/EMAIL_RELAY_PASS)');
    return;
  }

  const relayService = new EmailRelayService(config);
  
  try {
    const stats = await relayService.processPendingEmails(50);
    
    if (stats.processed > 0) {
      console.log(`Email Relay Cron: ${stats.processed} processed, ${stats.sent} sent, ${stats.failed} failed, ${stats.retried} retried`);
    }

    if (stats.errors.length > 0) {
      console.error('Relay errors:', stats.errors);
    }

  } catch (error) {
    console.error('Email Relay Cron failed:', error);
  }
}

// Запуск как standalone процесс
if (require.main === module) {
  console.log('Starting Email Relay Service...');
  
  // Запускаем каждые 30 секунд
  setInterval(runEmailRelayCron, 30000);
  
  // Запускаем сразу
  runEmailRelayCron().catch(console.error);
}

