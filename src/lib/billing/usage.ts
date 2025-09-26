import { db } from '@/db/client';
import { sql } from 'drizzle-orm';

export interface QuotaCheckResult {
  allowed: boolean;
  limit: number;
  current: number;
  percentage: number;
  window: string;
}

export interface UsageCounter {
  name: string;
  window: 'minute' | 'hour' | 'day' | 'month';
  limit: number;
  used: number;
  percentage: number;
  resetAt: Date;
}

export async function checkQuota(
  orgId: string,
  quotaName: string,
  window: 'minute' | 'hour' | 'day' | 'month'
): Promise<QuotaCheckResult> {
  try {
    const result = await db.execute(sql`
      SELECT * FROM check_quota(${orgId}, ${quotaName}, ${window})
    `);

    const data = result.rows[0] as any;
    
    return {
      allowed: data.allowed,
      limit: data.limit_value,
      current: Number(data.current_value),
      percentage: Number(data.usage_percent),
      window,
    };

  } catch (error) {
    console.error('Quota check failed:', error);
    return {
      allowed: true, // Fail open for safety
      limit: Number.MAX_SAFE_INTEGER,
      current: 0,
      percentage: 0,
      window,
    };
  }
}

export async function incrementUsage(
  orgId: string,
  counter: string,
  window: 'minute' | 'hour' | 'day' | 'month',
  amount: number = 1
): Promise<void> {
  try {
    await db.execute(sql`
      SELECT increment_usage_counter(${orgId}, ${counter}, ${window}, ${amount})
    `);
  } catch (error) {
    console.error('Failed to increment usage counter:', error);
  }
}

export async function getOrgUsageCounters(orgId: string): Promise<UsageCounter[]> {
  try {
    // Получаем подписку организации
    const subscriptionResult = await db.execute(sql`
      SELECT 
        os.plan_id,
        p.code as plan_code
      FROM org_subscriptions os
      JOIN plans p ON os.plan_id = p.id
      WHERE os.org_id = ${orgId}
      LIMIT 1
    `);

    if (subscriptionResult.rows.length === 0) {
      return [];
    }

    const planId = (subscriptionResult.rows[0] as any).plan_id;

    // Получаем все квоты плана
    const quotasResult = await db.execute(sql`
      SELECT name, "limit", window
      FROM plan_quotas
      WHERE plan_id = ${planId}
      ORDER BY name, window
    `);

    const quotas = quotasResult.rows.map(row => {
      const r = row as any;
      return {
        name: r.name,
        window: r.window,
        limit: r.limit,
      };
    });

    // Получаем текущее использование для каждой квоты
    const usageCounters: UsageCounter[] = [];

    for (const quota of quotas) {
      const usageResult = await db.execute(sql`
        SELECT * FROM check_quota(${orgId}, ${quota.name}, ${quota.window})
      `);

      const usage = usageResult.rows[0] as any;
      const percentage = quota.limit > 0 ? Math.round((Number(usage.current_value) / quota.limit) * 100) : 0;
      
      // Вычисляем время сброса
      const now = new Date();
      let resetAt: Date;
      
      switch (quota.window) {
        case 'minute':
          resetAt = new Date(now.getTime() + 60000);
          break;
        case 'hour':
          resetAt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1);
          break;
        case 'day':
          resetAt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
          break;
        case 'month':
          resetAt = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          break;
        default:
          resetAt = new Date(now.getTime() + 86400000); // 24 hours
      }

      usageCounters.push({
        name: quota.name,
        window: quota.window,
        limit: quota.limit,
        used: Number(usage.current_value),
        percentage: Math.min(percentage, 100),
        resetAt,
      });
    }

    return usageCounters;

  } catch (error) {
    console.error('Failed to get usage counters:', error);
    return [];
  }
}

export async function getUsageHistory(
  orgId: string,
  counter: string,
  window: 'minute' | 'hour' | 'day' | 'month',
  days: number = 30
): Promise<Array<{ date: string; value: number }>> {
  try {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const result = await db.execute(sql`
      SELECT 
        window_start,
        value
      FROM usage_counters
      WHERE org_id = ${orgId}
        AND counter = ${counter}
        AND window = ${window}
        AND window_start >= ${startDate.toISOString()}
      ORDER BY window_start ASC
    `);

    return result.rows.map(row => {
      const r = row as any;
      return {
        date: new Date(r.window_start).toISOString().slice(0, 10),
        value: Number(r.value),
      };
    });

  } catch (error) {
    console.error('Failed to get usage history:', error);
    return [];
  }
}

export async function enforceQuota(
  orgId: string,
  quotaName: string,
  window: 'minute' | 'hour' | 'day' | 'month',
  incrementAmount: number = 1
): Promise<{ allowed: boolean; reason?: string; quota?: QuotaCheckResult }> {
  try {
    // Проверяем текущую квоту
    const quotaCheck = await checkQuota(orgId, quotaName, window);
    
    // Если уже превышена, блокируем
    if (quotaCheck.current >= quotaCheck.limit) {
      return {
        allowed: false,
        reason: `Quota exceeded for ${quotaName} (${quotaCheck.current}/${quotaCheck.limit})`,
        quota: quotaCheck,
      };
    }

    // Проверяем, не превысим ли лимит после инкремента
    if (quotaCheck.current + incrementAmount > quotaCheck.limit) {
      return {
        allowed: false,
        reason: `Increment would exceed quota for ${quotaName}`,
        quota: quotaCheck,
      };
    }

    // Инкрементируем счетчик
    await incrementUsage(orgId, quotaName, window, incrementAmount);

    // Возвращаем обновленную квоту
    const updatedQuota = await checkQuota(orgId, quotaName, window);

    return {
      allowed: true,
      quota: updatedQuota,
    };

  } catch (error: any) {
    console.error('Quota enforcement failed:', error);
    return {
      allowed: false,
      reason: error.message,
    };
  }
}

export async function checkMultipleQuotas(
  orgId: string,
  quotaChecks: Array<{ name: string; window: 'minute' | 'hour' | 'day' | 'month'; amount?: number }>
): Promise<{ allowed: boolean; failedQuota?: string; results: Record<string, QuotaCheckResult> }> {
  const results: Record<string, QuotaCheckResult> = {};
  let allowed = true;
  let failedQuota: string | undefined;

  for (const check of quotaChecks) {
    const result = await checkQuota(orgId, check.name, check.window);
    results[check.name] = result;

    if (!result.allowed || (check.amount && result.current + check.amount > result.limit)) {
      allowed = false;
      failedQuota = check.name;
      break;
    }
  }

  return {
    allowed,
    failedQuota,
    results,
  };
}

export async function resetUsageCounter(
  orgId: string,
  counter: string,
  window: 'minute' | 'hour' | 'day' | 'month'
): Promise<void> {
  try {
    // Вычисляем окно
    let windowStart: Date;
    let windowEnd: Date;
    
    const now = new Date();
    
    switch (window) {
      case 'minute':
        windowStart = new Date(now.getTime() - now.getSeconds() * 1000);
        windowEnd = new Date(windowStart.getTime() + 60000);
        break;
      case 'hour':
        windowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());
        windowEnd = new Date(windowStart.getTime() + 3600000);
        break;
      case 'day':
        windowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        windowEnd = new Date(windowStart.getTime() + 86400000);
        break;
      case 'month':
        windowStart = new Date(now.getFullYear(), now.getMonth(), 1);
        windowEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        break;
      default:
        return;
    }

    await db.execute(sql`
      DELETE FROM usage_counters
      WHERE org_id = ${orgId}
        AND counter = ${counter}
        AND window_start = ${windowStart.toISOString()}
        AND window_end = ${windowEnd.toISOString()}
    `);

  } catch (error) {
    console.error('Failed to reset usage counter:', error);
  }
}

