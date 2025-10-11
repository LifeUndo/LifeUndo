"use client";
import React from "react";
import { usePathname } from "next/navigation";

// TODO: подключи реальный i18n-хук
function useI18n() {
  return (k: string) =>
    (
      {
        "footer.product": "Продукт",
        "footer.company": "Компания",
        "footer.legal": "Правовое",
        "footer.developers": "Разработчикам",
        "footer.partners": "Партнёрам",
        "footer.downloads": "Загрузки",
        "footer.pricing": "Тарифы",
        "footer.fund": "Фонд",
        "footer.support": "Поддержка",
        "footer.privacy": "Конфиденциальность",
        "footer.offer": "Оферта",
        "footer.sla": "SLA",
        "footer.contract": "Договор",
        "footer.dpa": "DPA",
        "footer.policy": "Политика",
        "footer.downloadsTxt": "Текст лицензии/загрузок",
      } as Record<string, string>
    )[k] ?? k;
}

export default function ModernFooter() {
  const t = useI18n();
  const pathname = usePathname() || "/";
  const seg = pathname.split("/").filter(Boolean)[0] || "ru";
  const withLocale = (p: string) => //en/partners ;

  const product = [
    { href: withLocale("/developers"), label: t("footer.developers") },
    { href: withLocale("/partners"), label: t("footer.partners") },
    { href: withLocale("/downloads"), label: t("footer.downloads") },
    { href: withLocale("/pricing"), label: t("footer.pricing") },
  ];

  const company = [
    { href: withLocale("/fund"), label: t("footer.fund") },
    { href: withLocale("/support"), label: t("footer.support") },
    { href: withLocale("/privacy"), label: t("footer.privacy") },
  ];

  const legal = [
    { href: withLocale("/legal/offer"), label: t("footer.offer") },
    { href: withLocale("/legal/sla"), label: t("footer.sla") },
    { href: withLocale("/legal/contract"), label: t("footer.contract") },
    { href: withLocale("/legal/dpa"), label: t("footer.dpa") },
    { href: withLocale("/privacy"), label: t("footer.policy") },
    { href: withLocale("/downloads"), label: t("footer.downloadsTxt") },
  ];

  return (
    <footer className="px-6 py-10 border-t border-white/10">
      <div className="grid sm:grid-cols-3 gap-6">
        <nav>
          <h4 className="font-semibold mb-2">{t("footer.product")}</h4>
          <ul className="space-y-1">{product.map((i) => <li key={i.href}><a href={i.href}>{i.label}</a></li>)}</ul>
        </nav>
        <nav>
          <h4 className="font-semibold mb-2">{t("footer.company")}</h4>
          <ul className="space-y-1">{company.map((i) => <li key={i.href}><a href={i.href}>{i.label}</a></li>)}</ul>
        </nav>
        <nav>
          <h4 className="font-semibold mb-2">{t("footer.legal")}</h4>
          <ul className="space-y-1">{legal.map((i) => <li key={i.href}><a href={i.href}>{i.label}</a></li>)}</ul>
        </nav>
      </div>
    </footer>
  );
}





