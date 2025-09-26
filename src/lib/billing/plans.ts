import { db } from '@/db/client';
import { sql } from 'drizzle-orm';

export interface Plan {
  id: string;
  code: string;
  name: string;
  description: string;
  priceCents: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  isActive: boolean;
  features: {
    priority_support?: boolean;
    sso_allowed?: boolean;
    webhook_premium?: boolean;
    white_label_full?: boolean;
  };
  quotas: PlanQuota[];
}

export interface PlanQuota {
  id: string;
  planId: string;
  name: string;
  limit: number;
  window: 'minute' | 'hour' | 'day' | 'month';
}

export async function getActivePlans(): Promise<Plan[]> {
  const result = await db.execute(sql`
    SELECT 
      p.id, p.code, p.name, p.description, p.price_cents, p.currency,
      p.billing_cycle, p.is_active, p.features
    FROM plans p
    WHERE p.is_active = true
    ORDER BY p.price_cents ASC
  `);

  const plans = result.rows.map(row => {
    const r = row as any;
    return {
      id: r.id,
      code: r.code,
      name: r.name,
      description: r.description,
      priceCents: r.price_cents,
      currency: r.currency,
      billingCycle: r.billing_cycle,
      isActive: r.is_active,
      features: r.features || {},
      quotas: [], // Будет заполнено отдельно
    };
  });

  // Загружаем квоты для каждого плана
  for (const plan of plans) {
    const quotasResult = await db.execute(sql`
      SELECT id, plan_id, name, "limit", window
      FROM plan_quotas
      WHERE plan_id = ${plan.id}
      ORDER BY name, window
    `);

    plan.quotas = quotasResult.rows.map(row => {
      const r = row as any;
      return {
        id: r.id,
        planId: r.plan_id,
        name: r.name,
        limit: r.limit,
        window: r.window,
      };
    });
  }

  return plans;
}

export async function getPlanByCode(code: string): Promise<Plan | null> {
  const result = await db.execute(sql`
    SELECT 
      p.id, p.code, p.name, p.description, p.price_cents, p.currency,
      p.billing_cycle, p.is_active, p.features
    FROM plans p
    WHERE p.code = ${code} AND p.is_active = true
    LIMIT 1
  `);

  if (result.rows.length === 0) {
    return null;
  }

  const r = result.rows[0] as any;
  const plan: Plan = {
    id: r.id,
    code: r.code,
    name: r.name,
    description: r.description,
    priceCents: r.price_cents,
    currency: r.currency,
    billingCycle: r.billing_cycle,
    isActive: r.is_active,
    features: r.features || {},
    quotas: [],
  };

  // Загружаем квоты
  const quotasResult = await db.execute(sql`
    SELECT id, plan_id, name, "limit", window
    FROM plan_quotas
    WHERE plan_id = ${plan.id}
    ORDER BY name, window
  `);

  plan.quotas = quotasResult.rows.map(row => {
    const r = row as any;
    return {
      id: r.id,
      planId: r.plan_id,
      name: r.name,
      limit: r.limit,
      window: r.window,
    };
  });

  return plan;
}

export async function getPlanById(id: string): Promise<Plan | null> {
  const result = await db.execute(sql`
    SELECT 
      p.id, p.code, p.name, p.description, p.price_cents, p.currency,
      p.billing_cycle, p.is_active, p.features
    FROM plans p
    WHERE p.id = ${id}
    LIMIT 1
  `);

  if (result.rows.length === 0) {
    return null;
  }

  const r = result.rows[0] as any;
  const plan: Plan = {
    id: r.id,
    code: r.code,
    name: r.name,
    description: r.description,
    priceCents: r.price_cents,
    currency: r.currency,
    billingCycle: r.billing_cycle,
    isActive: r.is_active,
    features: r.features || {},
    quotas: [],
  };

  // Загружаем квоты
  const quotasResult = await db.execute(sql`
    SELECT id, plan_id, name, "limit", window
    FROM plan_quotas
    WHERE plan_id = ${plan.id}
    ORDER BY name, window
  `);

  plan.quotas = quotasResult.rows.map(row => {
    const r = row as any;
    return {
      id: r.id,
      planId: r.plan_id,
      name: r.name,
      limit: r.limit,
      window: r.window,
    };
  });

  return plan;
}

export function formatPrice(cents: number, currency: string = 'USD'): string {
  const amount = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function getPlanComparison(plans: Plan[]): {
  features: string[];
  comparison: Record<string, Record<string, any>>;
} {
  const allFeatures = new Set<string>();
  
  // Собираем все возможные фичи
  plans.forEach(plan => {
    Object.keys(plan.features).forEach(feature => {
      allFeatures.add(feature);
    });
    plan.quotas.forEach(quota => {
      allFeatures.add(quota.name);
    });
  });

  const features = Array.from(allFeatures).sort();
  
  // Создаем матрицу сравнения
  const comparison: Record<string, Record<string, any>> = {};
  
  features.forEach(feature => {
    comparison[feature] = {};
    plans.forEach(plan => {
      if (plan.features.hasOwnProperty(feature)) {
        comparison[feature][plan.code] = plan.features[feature as keyof typeof plan.features];
      } else {
        // Ищем в квотах
        const quota = plan.quotas.find(q => q.name === feature);
        comparison[feature][plan.code] = quota ? quota.limit : 'N/A';
      }
    });
  });

  return { features, comparison };
}

