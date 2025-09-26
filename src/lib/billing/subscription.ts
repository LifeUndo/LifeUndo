import { db } from '@/db/client';
import { sql } from 'drizzle-orm';
import { Plan } from './plans';

export interface Subscription {
  id: string;
  orgId: string;
  planId: string;
  status: 'active' | 'past_due' | 'canceled' | 'trial';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  trialEnd?: Date;
  graceUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
  plan: Plan;
}

export interface SubscriptionWithUsage extends Subscription {
  quotas: {
    name: string;
    limit: number;
    window: 'minute' | 'hour' | 'day' | 'month';
    used: number;
    percentage: number;
  }[];
  isOverLimit: boolean;
  isInGrace: boolean;
  daysUntilRenewal: number;
}

export async function getOrgSubscription(orgId: string): Promise<Subscription | null> {
  const result = await db.execute(sql`
    SELECT 
      os.id, os.org_id, os.plan_id, os.status, os.current_period_start,
      os.current_period_end, os.trial_end, os.grace_until, os.created_at, os.updated_at,
      p.id as plan_id_full, p.code, p.name, p.description, p.price_cents, p.currency,
      p.billing_cycle, p.is_active, p.features
    FROM org_subscriptions os
    JOIN plans p ON os.plan_id = p.id
    WHERE os.org_id = ${orgId}
    LIMIT 1
  `);

  if (result.rows.length === 0) {
    return null;
  }

  const r = result.rows[0] as any;
  
  // Загружаем квоты плана
  const quotasResult = await db.execute(sql`
    SELECT id, plan_id, name, "limit", window
    FROM plan_quotas
    WHERE plan_id = ${r.plan_id}
    ORDER BY name, window
  `);

  const quotas = quotasResult.rows.map(row => {
    const q = row as any;
    return {
      id: q.id,
      planId: q.plan_id,
      name: q.name,
      limit: q.limit,
      window: q.window,
    };
  });

  const plan: Plan = {
    id: r.plan_id_full,
    code: r.code,
    name: r.name,
    description: r.description,
    priceCents: r.price_cents,
    currency: r.currency,
    billingCycle: r.billing_cycle,
    isActive: r.is_active,
    features: r.features || {},
    quotas,
  };

  return {
    id: r.id,
    orgId: r.org_id,
    planId: r.plan_id,
    status: r.status,
    currentPeriodStart: new Date(r.current_period_start),
    currentPeriodEnd: new Date(r.current_period_end),
    trialEnd: r.trial_end ? new Date(r.trial_end) : undefined,
    graceUntil: r.grace_until ? new Date(r.grace_until) : undefined,
    createdAt: new Date(r.created_at),
    updatedAt: new Date(r.updated_at),
    plan,
  };
}

export async function getSubscriptionWithUsage(orgId: string): Promise<SubscriptionWithUsage | null> {
  const subscription = await getOrgSubscription(orgId);
  if (!subscription) {
    return null;
  }

  // Получаем текущее использование для каждой квоты
  const quotasWithUsage = await Promise.all(
    subscription.plan.quotas.map(async (quota) => {
      const usageResult = await db.execute(sql`
        SELECT * FROM check_quota(${orgId}, ${quota.name}, ${quota.window})
      `);
      
      const usage = usageResult.rows[0] as any;
      const percentage = quota.limit > 0 ? Math.round((Number(usage.current_value) / quota.limit) * 100) : 0;
      
      return {
        name: quota.name,
        limit: quota.limit,
        window: quota.window,
        used: Number(usage.current_value),
        percentage: Math.min(percentage, 100),
      };
    })
  );

  // Проверяем превышение лимитов
  const isOverLimit = quotasWithUsage.some(q => q.percentage >= 100);
  const isInGrace = subscription.graceUntil && new Date() < subscription.graceUntil;
  
  // Дни до обновления
  const daysUntilRenewal = Math.ceil(
    (subscription.currentPeriodEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return {
    ...subscription,
    quotas: quotasWithUsage,
    isOverLimit,
    isInGrace,
    daysUntilRenewal: Math.max(0, daysUntilRenewal),
  };
}

export async function changeSubscriptionPlan(
  orgId: string, 
  newPlanCode: string,
  prorationNote?: string
): Promise<{ success: boolean; message: string; subscription?: Subscription }> {
  try {
    // Получаем новый план
    const newPlanResult = await db.execute(sql`
      SELECT id FROM plans WHERE code = ${newPlanCode} AND is_active = true LIMIT 1
    `);

    if (newPlanResult.rows.length === 0) {
      return { success: false, message: 'Plan not found' };
    }

    const newPlanId = (newPlanResult.rows[0] as any).id;

    // Обновляем подписку
    const now = new Date();
    const nextPeriodEnd = new Date(now);
    nextPeriodEnd.setMonth(nextPeriodEnd.getMonth() + 1); // Monthly cycle

    await db.execute(sql`
      UPDATE org_subscriptions 
      SET 
        plan_id = ${newPlanId},
        current_period_start = ${now.toISOString()},
        current_period_end = ${nextPeriodEnd.toISOString()},
        grace_until = NULL,
        updated_at = now()
      WHERE org_id = ${orgId}
    `);

    // Логируем изменение
    await db.execute(sql`
      INSERT INTO audit_log (org_id, actor_type, actor_id, action, target_type, target_id, meta)
      VALUES (
        ${orgId}, 
        'system', 
        'billing-service', 
        'subscription_plan_changed', 
        'org_subscriptions', 
        ${orgId},
        ${JSON.stringify({ 
          newPlanCode, 
          prorationNote,
          effectiveDate: now.toISOString() 
        })}
      )
    `);

    const updatedSubscription = await getOrgSubscription(orgId);
    
    return { 
      success: true, 
      message: `Plan changed to ${newPlanCode}`,
      subscription: updatedSubscription || undefined,
    };

  } catch (error: any) {
    console.error('Failed to change subscription plan:', error);
    return { success: false, message: error.message };
  }
}

export async function extendGracePeriod(
  orgId: string,
  graceUntil: Date
): Promise<{ success: boolean; message: string }> {
  try {
    await db.execute(sql`
      UPDATE org_subscriptions 
      SET 
        grace_until = ${graceUntil.toISOString()},
        updated_at = now()
      WHERE org_id = ${orgId}
    `);

    // Логируем продление grace period
    await db.execute(sql`
      INSERT INTO audit_log (org_id, actor_type, actor_id, action, target_type, target_id, meta)
      VALUES (
        ${orgId}, 
        'system', 
        'billing-service', 
        'grace_period_extended', 
        'org_subscriptions', 
        ${orgId},
        ${JSON.stringify({ 
          graceUntil: graceUntil.toISOString() 
        })}
      )
    `);

    return { success: true, message: 'Grace period extended' };

  } catch (error: any) {
    console.error('Failed to extend grace period:', error);
    return { success: false, message: error.message };
  }
}

export async function renewSubscription(orgId: string): Promise<{ success: boolean; message: string }> {
  try {
    const subscription = await getOrgSubscription(orgId);
    if (!subscription) {
      return { success: false, message: 'Subscription not found' };
    }

    const now = new Date();
    const nextPeriodStart = subscription.currentPeriodEnd;
    const nextPeriodEnd = new Date(nextPeriodStart);
    
    if (subscription.plan.billingCycle === 'monthly') {
      nextPeriodEnd.setMonth(nextPeriodEnd.getMonth() + 1);
    } else {
      nextPeriodEnd.setFullYear(nextPeriodEnd.getFullYear() + 1);
    }

    await db.execute(sql`
      UPDATE org_subscriptions 
      SET 
        current_period_start = ${nextPeriodStart.toISOString()},
        current_period_end = ${nextPeriodEnd.toISOString()},
        grace_until = NULL,
        updated_at = now()
      WHERE org_id = ${orgId}
    `);

    // Логируем обновление
    await db.execute(sql`
      INSERT INTO audit_log (org_id, actor_type, actor_id, action, target_type, target_id, meta)
      VALUES (
        ${orgId}, 
        'system', 
        'billing-service', 
        'subscription_renewed', 
        'org_subscriptions', 
        ${orgId},
        ${JSON.stringify({ 
          newPeriodStart: nextPeriodStart.toISOString(),
          newPeriodEnd: nextPeriodEnd.toISOString()
        })}
      )
    `);

    return { success: true, message: 'Subscription renewed' };

  } catch (error: any) {
    console.error('Failed to renew subscription:', error);
    return { success: false, message: error.message };
  }
}

