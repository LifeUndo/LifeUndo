// FreeKassa Plans Configuration
// Все тарифы с фиксированными суммами и параметрами

export type PlanKind = "subscription" | "lifetime" | "team" | "bundle";

export interface FKPlan {
  amount: string;
  currency: string;
  title: string;
  kind: PlanKind;
  periodDays?: number;
  seats?: number;
  bonusFlag?: string;
}

export const FK_PLANS = {
  pro_month: {
    amount: "599.00",
    currency: "RUB",
    title: "Pro / месяц",
    kind: "subscription",
    periodDays: 30
  },
  vip_lifetime: {
    amount: "9990.00",
    currency: "RUB",
    title: "VIP навсегда",
    kind: "lifetime"
  },
  team_5: {
    amount: "2990.00",
    currency: "RUB",
    title: "Team / 5 мест / мес",
    kind: "team",
    seats: 5,
    periodDays: 30
  },
  // Starter Bundle — Pro на 6 месяцев + бонусный флаг
  starter_6m: {
    amount: "3000.00",
    currency: "RUB",
    title: "Starter Bundle (6 мес.)",
    kind: "bundle",
    periodDays: 180,
    bonusFlag: "starter_bonus"
  }
} as const satisfies Record<string, FKPlan>;

export type PlanId = keyof typeof FK_PLANS;

// Генератор префиксов для order_id
export function getOrderPrefix(plan: PlanId): string {
  const prefixes: Record<PlanId, string> = {
    pro_month: "PROM",
    vip_lifetime: "VIPL",
    team_5: "TEAM5",
    starter_6m: "S6M"
  };
  return prefixes[plan] || "ORDER";
}

// Валидация плана
export function isValidPlan(plan: string): plan is PlanId {
  return plan in FK_PLANS;
}

// Получить конфигурацию плана
export function getPlan(planId: string): FKPlan | null {
  if (!isValidPlan(planId)) return null;
  return FK_PLANS[planId];
}

