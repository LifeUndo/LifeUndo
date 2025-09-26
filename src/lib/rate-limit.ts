import { RBACContext } from './rbac/guard';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory rate limiter (для демо)
// В продакшене использовать Redis
const rateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

export async function checkRateLimit(
  context: RBACContext,
  scope: string,
  windowMinutes: number = 1
): Promise<RateLimitResult> {
  if (!context.isAuthenticated || !context.org) {
    return {
      allowed: false,
      limit: 0,
      remaining: 0,
      resetTime: Date.now(),
    };
  }

  const now = Date.now();
  const windowMs = windowMinutes * 60 * 1000;
  const key = `${context.org.id}:${scope}:${Math.floor(now / windowMs)}`;
  
  // Получаем лимит из контекста
  let limit = 120; // дефолтный лимит
  
  if (context.apiKey) {
    limit = context.apiKey.rateLimit;
  } else if (context.membership) {
    // Лимиты по ролям
    const roleLimits: Record<string, number> = {
      admin: 1000,
      operator: 500,
      auditor: 200,
      partner: 300,
      viewer: 100,
    };
    limit = roleLimits[context.membership.role] || 120;
  }

  const entry = rateLimitStore.get(key);
  const resetTime = now + windowMs;

  if (!entry || entry.resetTime < now) {
    // Новое окно
    rateLimitStore.set(key, {
      count: 1,
      resetTime,
    });
    
    return {
      allowed: true,
      limit,
      remaining: limit - 1,
      resetTime,
    };
  }

  if (entry.count >= limit) {
    // Лимит превышен
    return {
      allowed: false,
      limit,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter: Math.ceil((entry.resetTime - now) / 1000),
    };
  }

  // Увеличиваем счетчик
  entry.count++;
  rateLimitStore.set(key, entry);

  return {
    allowed: true,
    limit,
    remaining: limit - entry.count,
    resetTime: entry.resetTime,
  };
}

// Очистка старых записей (вызывать периодически)
export function cleanupRateLimit(): void {
  const now = Date.now();
  for (const key of Array.from(rateLimitStore.keys())) {
    const entry = rateLimitStore.get(key);
    if (entry && entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}

// Проверка квот из базы данных
export async function checkQuota(
  context: RBACContext,
  quotaName: string
): Promise<{ allowed: boolean; limit: number; used: number; resetAt: Date }> {
  if (!context.isAuthenticated || !context.org) {
    return {
      allowed: false,
      limit: 0,
      used: 0,
      resetAt: new Date(),
    };
  }

  try {
    const { db } = await import('@/db/client');
    const { sql } = await import('drizzle-orm');

    const quotaResult = await db.execute(sql`
      SELECT name, "limit", window, reset_at
      FROM quotas
      WHERE org_id = ${context.org.id} AND name = ${quotaName}
      LIMIT 1
    `);

    if (quotaResult.rows.length === 0) {
      return {
        allowed: true,
        limit: Number.MAX_SAFE_INTEGER,
        used: 0,
        resetAt: new Date(),
      };
    }

    const quota = quotaResult.rows[0] as any;
    const now = new Date();
    const resetAt = new Date(quota.reset_at || now);

    // Если время сброса прошло, обновляем его
    if (resetAt <= now) {
      const nextReset = getNextResetTime(quota.window);
      await db.execute(sql`
        UPDATE quotas 
        SET reset_at = ${nextReset.toISOString()}
        WHERE org_id = ${context.org.id} AND name = ${quotaName}
      `);
    }

    // Подсчитываем использование (пример для emails_per_day)
    let used = 0;
    if (quotaName === 'emails_per_day') {
      const usageResult = await db.execute(sql`
        SELECT COUNT(*) as count
        FROM email_outbox
        WHERE org_id = ${context.org.id} 
          AND created_at >= ${quota.reset_at || now.toISOString()}
      `);
      used = Number((usageResult.rows[0] as any).count);
    } else if (quotaName === 'api_reads_per_min') {
      const usageResult = await db.execute(sql`
        SELECT COUNT(*) as count
        FROM usage_events
        WHERE org_id = ${context.org.id}
          AND ts >= ${new Date(now.getTime() - 60000).toISOString()}
          AND method IN ('GET', 'HEAD', 'OPTIONS')
      `);
      used = Number((usageResult.rows[0] as any).count);
    }

    return {
      allowed: used < quota.limit,
      limit: quota.limit,
      used,
      resetAt: new Date(quota.reset_at || now),
    };

  } catch (error) {
    console.error('Quota check error:', error);
    return {
      allowed: true,
      limit: Number.MAX_SAFE_INTEGER,
      used: 0,
      resetAt: new Date(),
    };
  }
}

function getNextResetTime(window: string): Date {
  const now = new Date();
  
  switch (window) {
    case 'minute':
      return new Date(now.getTime() + 60000);
    case 'hour':
      return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1);
    case 'day':
      return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    case 'month':
      return new Date(now.getFullYear(), now.getMonth() + 1, 1);
    default:
      return new Date(now.getTime() + 60000);
  }
}

// Middleware для rate limiting
export async function withRateLimit<T extends any[]>(
  handler: (req: Request, ...args: T) => Promise<Response>,
  scope: string,
  windowMinutes: number = 1
) {
  return async (req: Request, ...args: T): Promise<Response> => {
    const context = (req as any).rbacContext as RBACContext;
    
    if (!context) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Rate limit check requires authentication' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const rateLimit = await checkRateLimit(context, scope, windowMinutes);
    
    if (!rateLimit.allowed) {
      const response = new Response(
        JSON.stringify({ 
          ok: false, 
          error: 'Rate limit exceeded',
          retryAfter: rateLimit.retryAfter,
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
      
      response.headers.set('X-RateLimit-Limit', rateLimit.limit.toString());
      response.headers.set('X-RateLimit-Remaining', '0');
      response.headers.set('X-RateLimit-Reset', Math.ceil(rateLimit.resetTime / 1000).toString());
      
      if (rateLimit.retryAfter) {
        response.headers.set('Retry-After', rateLimit.retryAfter.toString());
      }
      
      return response;
    }

    // Добавляем заголовки rate limit
    const response = await handler(req, ...args);
    response.headers.set('X-RateLimit-Limit', rateLimit.limit.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
    response.headers.set('X-RateLimit-Reset', Math.ceil(rateLimit.resetTime / 1000).toString());
    
    return response;
  };
}

