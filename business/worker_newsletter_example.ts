/**
 * Newsletter Worker Example
 * 
 * This is a production-ready newsletter worker implementation
 * using BullMQ for job processing and PostgreSQL for data storage.
 * 
 * Features:
 * - Anti-duplicate logic
 * - Graceful error handling
 * - Rate limiting
 * - Admin controls
 * - Metrics and monitoring
 */

import { Pool } from 'pg';
import nodemailer from 'nodemailer';
import { Queue, Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { Logger } from 'winston';

// Configuration
const config = {
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'lifeundo',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  },
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
  newsletter: {
    batchSize: parseInt(process.env.NEWSLETTER_BATCH_SIZE || '50'),
    cadenceDays: parseInt(process.env.NEWSLETTER_CADENCE_DAYS || '30'),
    maxRetries: 3,
    retryDelay: 5000, // 5 seconds
  }
};

// Initialize connections
const pool = new Pool(config.database);
const redis = new Redis(config.redis);
const mailer = nodemailer.createTransporter(config.email);

// Logger setup
const logger = Logger.createLogger({
  level: 'info',
  format: Logger.format.combine(
    Logger.format.timestamp(),
    Logger.format.json()
  ),
  transports: [
    new Logger.transports.Console(),
    new Logger.transports.File({ filename: 'newsletter-worker.log' })
  ]
});

// Queue setup
const newsletterQueue = new Queue('newsletter', {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: config.newsletter.maxRetries,
    backoff: {
      type: 'exponential',
      delay: config.newsletter.retryDelay,
    },
  },
});

/**
 * Pick a random template that hasn't been sent to the user
 */
async function pickTemplateForUser(client: any, accountId: number): Promise<number | null> {
  try {
    // Get all active templates
    const templatesRes = await client.query(
      `SELECT id FROM newsletter_templates 
       WHERE locale = 'ru' AND is_active = true 
       ORDER BY random()`
    );

    // Check which templates have already been sent
    for (const template of templatesRes.rows) {
      const sentRes = await client.query(
        `SELECT 1 FROM newsletter_sent 
         WHERE account_id = $1 AND template_id = $2 
         LIMIT 1`,
        [accountId, template.id]
      );

      if (sentRes.rowCount === 0) {
        return template.id;
      }
    }

    // All templates have been sent
    logger.warn(`All templates exhausted for user ${accountId}`);
    return null;
  } catch (error) {
    logger.error(`Error picking template for user ${accountId}:`, error);
    throw error;
  }
}

/**
 * Send newsletter to a single user
 */
async function sendNewsletterForUser(accountId: number): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Lock the schedule row to prevent race conditions
    const scheduleRes = await client.query(
      `SELECT * FROM newsletter_schedule 
       WHERE account_id = $1 AND active = true 
       FOR UPDATE`,
      [accountId]
    );

    if (scheduleRes.rowCount === 0) {
      logger.info(`No active schedule found for user ${accountId}`);
      await client.query('COMMIT');
      return;
    }

    const schedule = scheduleRes.rows[0];

    // Check if it's time to send
    if (schedule.next_send_at > new Date()) {
      logger.info(`Not time to send for user ${accountId} yet`);
      await client.query('COMMIT');
      return;
    }

    // Pick a template
    const templateId = await pickTemplateForUser(client, accountId);
    
    if (!templateId) {
      // All templates exhausted - schedule next cycle in 12 months
      await client.query(
        `UPDATE newsletter_schedule 
         SET next_send_at = now() + interval '365 days',
             cycle_started_at = now(),
             updated_at = now()
         WHERE account_id = $1`,
        [accountId]
      );
      
      logger.info(`Scheduled next cycle for user ${accountId} in 12 months`);
      await client.query('COMMIT');
      return;
    }

    // Get template details
    const templateRes = await client.query(
      `SELECT * FROM newsletter_templates WHERE id = $1`,
      [templateId]
    );

    if (templateRes.rowCount === 0) {
      throw new Error(`Template ${templateId} not found`);
    }

    const template = templateRes.rows[0];

    // Get user details
    const userRes = await client.query(
      `SELECT email, display_name FROM accounts WHERE id = $1`,
      [accountId]
    );

    if (userRes.rowCount === 0) {
      throw new Error(`User ${accountId} not found`);
    }

    const user = userRes.rows[0];

    // Personalize template
    const personalizedBody = template.body
      .replace(/\{user_name\}/g, user.display_name || 'Друг')
      .replace(/\{plan\}/g, 'Pro')
      .replace(/\{example\}/g, 'важный документ');

    // Send email
    await mailer.sendMail({
      to: user.email,
      subject: template.title,
      html: personalizedBody,
      headers: {
        'List-Unsubscribe': '<mailto:unsubscribe@lifeundo.ru>',
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      }
    });

    // Record the send
    await client.query(
      `INSERT INTO newsletter_sent (account_id, template_id, sent_at) 
       VALUES ($1, $2, now())`,
      [accountId, templateId]
    );

    // Schedule next send with jitter
    const jitterHours = Math.floor(Math.random() * 72); // 0-72 hours
    await client.query(
      `UPDATE newsletter_schedule 
       SET next_send_at = now() + interval '${config.newsletter.cadenceDays} days' + interval '${jitterHours} hours',
           updated_at = now()
       WHERE account_id = $1`,
      [accountId]
    );

    await client.query('COMMIT');
    
    logger.info(`Newsletter sent to user ${accountId} with template ${templateId}`);
    
    // Update metrics
    await redis.incr('newsletter:sent:today');
    await redis.incr(`newsletter:sent:template:${templateId}`);

  } catch (error) {
    await client.query('ROLLBACK');
    logger.error(`Error sending newsletter to user ${accountId}:`, error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Process newsletter jobs
 */
const newsletterWorker = new Worker('newsletter', async (job: Job) => {
  const { accountId } = job.data;
  
  try {
    await sendNewsletterForUser(accountId);
    logger.info(`Successfully processed newsletter job for user ${accountId}`);
  } catch (error) {
    logger.error(`Failed to process newsletter job for user ${accountId}:`, error);
    throw error;
  }
}, {
  connection: redis,
  concurrency: 5, // Process up to 5 jobs concurrently
});

/**
 * Scheduled job to find users ready for newsletter
 */
async function scheduleNewsletterJobs(): Promise<void> {
  const client = await pool.connect();
  
  try {
    // Find users ready for newsletter
    const readyUsersRes = await client.query(
      `SELECT account_id FROM newsletter_schedule 
       WHERE active = true 
         AND next_send_at <= now()
         AND account_id NOT IN (
           SELECT account_id FROM subscriptions 
           WHERE status = 'active'
         )
       LIMIT $1`,
      [config.newsletter.batchSize]
    );

    logger.info(`Found ${readyUsersRes.rowCount} users ready for newsletter`);

    // Add jobs to queue
    for (const user of readyUsersRes.rows) {
      await newsletterQueue.add('send-newsletter', {
        accountId: user.account_id,
      }, {
        delay: Math.random() * 60000, // Random delay up to 1 minute
      });
    }

  } catch (error) {
    logger.error('Error scheduling newsletter jobs:', error);
  } finally {
    client.release();
  }
}

/**
 * Stop newsletter for user (when subscription becomes active)
 */
async function stopNewsletterForUser(accountId: number): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query(
      `UPDATE newsletter_schedule 
       SET active = false, updated_at = now()
       WHERE account_id = $1`,
      [accountId]
    );

    logger.info(`Stopped newsletter for user ${accountId}`);
  } catch (error) {
    logger.error(`Error stopping newsletter for user ${accountId}:`, error);
  } finally {
    client.release();
  }
}

/**
 * Admin function to manually send newsletter
 */
async function sendManualNewsletter(
  accountId: number, 
  templateId: number, 
  adminId: number
): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Check if template exists
    const templateRes = await client.query(
      `SELECT * FROM newsletter_templates WHERE id = $1 AND is_active = true`,
      [templateId]
    );

    if (templateRes.rowCount === 0) {
      throw new Error(`Template ${templateId} not found or inactive`);
    }

    // Check if already sent
    const sentRes = await client.query(
      `SELECT 1 FROM newsletter_sent 
       WHERE account_id = $1 AND template_id = $2`,
      [accountId, templateId]
    );

    if (sentRes.rowCount > 0) {
      throw new Error(`Template ${templateId} already sent to user ${accountId}`);
    }

    // Send newsletter
    await sendNewsletterForUser(accountId);

    // Log admin action
    await client.query(
      `INSERT INTO admin_audit_log (admin_id, action, target_type, target_id, details)
       VALUES ($1, 'send_newsletter', 'user', $2, $3)`,
      [adminId, accountId, JSON.stringify({ templateId, manual: true })]
    );

    await client.query('COMMIT');
    logger.info(`Manual newsletter sent to user ${accountId} by admin ${adminId}`);

  } catch (error) {
    await client.query('ROLLBACK');
    logger.error(`Error sending manual newsletter:`, error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Health check endpoint
 */
async function healthCheck(): Promise<{ status: string; metrics: any }> {
  try {
    // Check database connection
    await pool.query('SELECT 1');
    
    // Check Redis connection
    await redis.ping();
    
    // Get queue metrics
    const waiting = await newsletterQueue.getWaiting();
    const active = await newsletterQueue.getActive();
    const completed = await newsletterQueue.getCompleted();
    const failed = await newsletterQueue.getFailed();

    return {
      status: 'healthy',
      metrics: {
        queue: {
          waiting: waiting.length,
          active: active.length,
          completed: completed.length,
          failed: failed.length,
        },
        database: 'connected',
        redis: 'connected',
      }
    };
  } catch (error) {
    logger.error('Health check failed:', error);
    return {
      status: 'unhealthy',
      metrics: { error: error.message }
    };
  }
}

// Export functions for external use
export {
  sendNewsletterForUser,
  stopNewsletterForUser,
  sendManualNewsletter,
  scheduleNewsletterJobs,
  healthCheck,
  newsletterQueue,
};

// Start the worker if this file is run directly
if (require.main === module) {
  logger.info('Starting newsletter worker...');
  
  // Schedule jobs every 10 minutes
  setInterval(scheduleNewsletterJobs, 10 * 60 * 1000);
  
  // Initial run
  scheduleNewsletterJobs();
  
  // Graceful shutdown
  process.on('SIGTERM', async () => {
    logger.info('Shutting down newsletter worker...');
    await newsletterWorker.close();
    await newsletterQueue.close();
    await redis.disconnect();
    await pool.end();
    process.exit(0);
  });
}
