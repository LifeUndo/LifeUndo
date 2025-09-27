import { db } from '@/db/client';
import { sql } from 'drizzle-orm';
import { createInvoice, finalizeInvoice } from '@/lib/billing/invoice';
import { renewSubscription } from '@/lib/billing/subscription';
import { getPlanById } from '@/lib/billing/plans';

export interface BillingPeriodStats {
  processed: number;
  renewed: number;
  invoicesCreated: number;
  errors: string[];
}

export async function closeBillingPeriods(): Promise<BillingPeriodStats> {
  const stats: BillingPeriodStats = {
    processed: 0,
    renewed: 0,
    invoicesCreated: 0,
    errors: [],
  };

  try {
    console.log('Starting billing period closure...');

    // Находим подписки с истекшим периодом
    const expiredSubscriptions = await db.execute(sql`
      SELECT 
        os.id, os.org_id, os.plan_id, os.current_period_start, os.current_period_end,
        p.price_cents, p.currency, p.billing_cycle
      FROM org_subscriptions os
      JOIN plans p ON os.plan_id = p.id
      WHERE os.status = 'active' 
        AND os.current_period_end <= now()
      ORDER BY os.current_period_end ASC
    `);

    console.log(`Found ${expiredSubscriptions.rows.length} expired subscriptions`);

    for (const subscription of expiredSubscriptions.rows) {
      try {
        const sub = subscription as any;
        stats.processed++;

        // Создаем инвойс за прошедший период
        const plan = await getPlanById(sub.plan_id);
        if (!plan) {
          stats.errors.push(`Plan not found for subscription ${sub.id}`);
          continue;
        }

        // Создаем строки инвойса
        const invoiceLines = [];
        
        if (sub.price_cents > 0) {
          invoiceLines.push({
            sku: `plan-${plan.code.toLowerCase()}`,
            description: `${plan.name} - ${plan.billingCycle} subscription`,
            quantity: 1,
            unitCents: sub.price_cents,
          });
        }

        // Создаем инвойс
        const invoice = await createInvoice(
          sub.org_id,
          sub.id,
          new Date(sub.current_period_start),
          new Date(sub.current_period_end),
          invoiceLines
        );

        if (invoice) {
          // Финализируем инвойс (draft → open)
          await finalizeInvoice(invoice.id);
          stats.invoicesCreated++;
          console.log(`Created invoice ${invoice.invoiceNumber} for org ${sub.org_id}`);
        }

        // Продлеваем подписку на следующий период
        await renewSubscription(sub.org_id);
        stats.renewed++;
        console.log(`Renewed subscription for org ${sub.org_id}`);

      } catch (error: any) {
        console.error(`Failed to process subscription ${subscription.id}:`, error);
        stats.errors.push(`Subscription ${subscription.id}: ${error.message}`);
      }
    }

    // Очищаем старые usage counters (старше 90 дней)
    const cleanupResult = await db.execute(sql`
      DELETE FROM usage_counters
      WHERE window_start < now() - interval '90 days'
    `);

    console.log(`Cleaned up ${cleanupResult.rowCount || 0} old usage counters`);

    console.log(`Billing period closure completed:`, stats);

  } catch (error: any) {
    console.error('Billing period closure failed:', error);
    stats.errors.push(`System error: ${error.message}`);
  }

  return stats;
}

// Функция для отправки уведомлений о превышении лимитов
export async function checkUsageLimits(): Promise<void> {
  try {
    console.log('Checking usage limits...');

    // Находим организации с превышением лимитов
    const overLimitOrgs = await db.execute(sql`
      SELECT DISTINCT 
        os.org_id,
        os.grace_until,
        o.name as org_name
      FROM org_subscriptions os
      JOIN orgs o ON os.org_id = o.id
      WHERE os.status = 'active'
        AND (os.grace_until IS NULL OR os.grace_until > now())
    `);

    for (const org of overLimitOrgs.rows) {
      const orgData = org as any;
      
      // Проверяем квоты организации
      const quotasResult = await db.execute(sql`
        SELECT 
          pq.name, pq."limit", pq.window,
          COALESCE(uc.value, 0) as current_usage
        FROM org_subscriptions os
        JOIN plan_quotas pq ON os.plan_id = pq.plan_id
        LEFT JOIN usage_counters uc ON (
          os.org_id = uc.org_id 
          AND pq.name = uc.counter 
          AND pq.window = uc.window
          AND uc.window_start <= now() 
          AND uc.window_end > now()
        )
        WHERE os.org_id = ${orgData.org_id}
          AND os.status = 'active'
      `);

      let hasOverLimit = false;
      const overLimitQuotas = [];

      for (const quota of quotasResult.rows) {
        const q = quota as any;
        const usagePercent = q.limit > 0 ? (Number(q.current_usage) / q.limit) * 100 : 0;
        
        if (usagePercent >= 100) {
          hasOverLimit = true;
          overLimitQuotas.push({
            name: q.name,
            limit: q.limit,
            used: Number(q.current_usage),
            percentage: Math.round(usagePercent),
          });
        }
      }

      if (hasOverLimit && !orgData.grace_until) {
        // Устанавливаем grace period (24 часа)
        const graceUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
        
        await db.execute(sql`
          UPDATE org_subscriptions 
          SET grace_until = ${graceUntil.toISOString()}
          WHERE org_id = ${orgData.org_id}
        `);

        console.log(`Set grace period for org ${orgData.org_name} (${orgData.org_id}) until ${graceUntil.toISOString()}`);

        // TODO: Отправить webhook/email уведомление
        // await sendUsageLimitNotification(orgData.org_id, overLimitQuotas);
      }
    }

  } catch (error) {
    console.error('Failed to check usage limits:', error);
  }
}

// Главная функция cron job
export async function runBillingCron(): Promise<void> {
  console.log('Starting billing cron job...');
  
  try {
    // Закрываем периоды и создаем инвойсы
    const periodStats = await closeBillingPeriods();
    
    // Проверяем превышение лимитов
    await checkUsageLimits();
    
    console.log('Billing cron completed successfully:', periodStats);
    
  } catch (error) {
    console.error('Billing cron failed:', error);
  }
}

// Запуск как standalone процесс
if (require.main === module) {
  console.log('Starting Billing Cron Service...');
  
  // Запускаем каждые 24 часа
  setInterval(runBillingCron, 24 * 60 * 60 * 1000);
  
  // Запускаем сразу
  runBillingCron().catch(console.error);
}


