"use client";
import React from "react";
import { PLAN_TO_PRODUCT, type PlanKey } from "@/business/pricing/plans";

// TODO: подключи свой i18n-хук (например, useTranslations()) и замени useI18n().
function useI18n() {
  return (k: string) =>
    (
      {
        "errors.unknownPlan": "Неизвестный тариф",
        "errors.fkUnavailable": "Платёж сейчас недоступен. Попробуйте позже.",
        "common.payWithFreeKassa": "Оплатить через FreeKassa",
      } as Record<string, string>
    )[k] ?? k;
}

type Props = {
  plan: PlanKey;
  email?: string;
  className?: string;
};

export default function FreeKassaButton({ plan, email = "test@example.com", className }: Props) {
  const t = useI18n();
  const productId = PLAN_TO_PRODUCT[plan];
  const disabled = !productId;

  const onClick = async () => {
    if (disabled) return;
    try {
      const payload = { plan, productId, email };
      const r = await fetch("/api/payments/freekassa/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await r.json().catch(() => ({} as any));
      if (!r.ok || !j?.pay_url) {
        alert(t("errors.fkUnavailable"));
        return;
      }
      window.location.href = j.pay_url as string;
    } catch {
      alert(t("errors.fkUnavailable"));
    }
  };

  return (
    <button className={className} disabled={disabled} onClick={onClick} title={disabled ? t("errors.unknownPlan") : ""}>
      {t("common.payWithFreeKassa")}
    </button>
  );
}
