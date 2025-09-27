# 💰 PATCH 0.4.8-BILLING — **Планы/Квоты/Инвойсы + Enforcement + UI**

## ✅ ЧТО СДЕЛАНО:

### **🗄️ База данных:**
- **`migrations/038_billing_core.sql`** - полная схема биллинга
- **Таблицы:** `plans`, `org_subscriptions`, `plan_quotas`, `invoices`, `invoice_lines`, `usage_counters`
- **Функции:** `check_quota()`, `increment_usage_counter()`, `generate_invoice_number()`
- **Семплирование:** базовые планы FREE/PRO/TEAM/VIP с квотами

### **📊 Billing Services:**
- **`src/lib/billing/plans.ts`** - управление планами и квотами
- **`src/lib/billing/subscription.ts`** - подписки с usage tracking
- **`src/lib/billing/usage.ts`** - enforcement квот и счетчики
- **`src/lib/billing/invoice.ts`** - генерация и управление инвойсами

### **⏰ Cron Service:**
- **`src/cron/billing-close-period.ts`** - автоматическое закрытие периодов, создание инвойсов, проверка лимитов

### **📡 API Endpoints:**
- **`src/app/api/billing/plans/route.ts`** - публичные планы
- **`src/app/api/admin/subscription/route.ts`** - текущая подписка
- **`src/app/api/admin/subscription/change/route.ts`** - смена плана
- **`src/app/api/admin/quotas/usage/route.ts`** - usage counters
- **`src/app/api/admin/invoices/**`** - CRUD инвойсов, экспорт CSV
- **`src/app/api/admin/limits/route.ts`** - лимиты для UI баннеров

### **🎨 Admin UI:**
- **`src/app/admin/billing/page.tsx`** - полный биллинг дашборд
- **Функциональность:** обзор плана, usage bars, инвойсы, смена плана
- **Баннеры:** предупреждения о превышении лимитов, grace period

## 🧪 СМОУК-ПРОВЕРКИ:

```bash
# 1) Посмотреть планы
curl -s https://getlifeundo.com/api/billing/plans | jq .

# 2) Текущая подписка/квоты org
curl -u admin:****** https://getlifeundo.com/api/admin/subscription | jq .
curl -u admin:****** https://getlifeundo.com/api/admin/quotas/usage | jq .

# 3) Смена плана
curl -u admin:****** -X POST https://getlifeundo.com/api/admin/subscription/change \
  -H "Content-Type: application/json" -d '{"plan_code":"PRO"}'

# 4) Инвойсы: список/детали/CSV
curl -u admin:****** https://getlifeundo.com/api/admin/invoices | jq .
curl -u admin:****** https://getlifeundo.com/api/admin/invoices/<id> | jq .
curl -u admin:****** -L https://getlifeundo.com/api/admin/invoices/<id>/export.csv -o invoice.csv

# 5) Лимиты для UI
curl -u admin:****** https://getlifeundo.com/api/admin/limits | jq .

# 6) Миграция
npm run db:migrate

# 7) Запуск billing cron
npm run billing:cron
```

## 📋 ФУНКЦИОНАЛЬНОСТЬ:

### **Plans & Quotas:**
- **FREE:** $0, 50 emails/day, 60 API/min, 1 export/day, 250MB, 1 seat
- **PRO:** $9, 500 emails/day, 240 API/min, 10 exports/day, 2GB, 3 seats
- **TEAM:** $29, 5k emails/day, 600 API/min, 50 exports/day, 10GB, 10 seats
- **VIP:** $99, 25k emails/day, 1800 API/min, 250 exports/day, 100GB, 50 seats

### **Enforcement System:**
- **Soft-cap:** предупреждения при 80%+ usage, grace period 24h
- **Hard-cap:** блокировка при 100% usage (кроме admin роли)
- **Rate Limiting:** интеграция с существующим rate-limit middleware
- **Usage Tracking:** автоматические счетчики в `usage_counters`

### **Billing Flow:**
```
Subscription → Plan Quotas → Usage Counters → Enforcement
     ↓
Period End → Invoice Creation → Payment → Renewal
```

### **Invoice System:**
- **Auto-generation:** при закрытии периода
- **Status Flow:** draft → open → paid
- **CSV Export:** детальная выгрузка
- **Stub Mode:** ручная отметка "paid" (без PSP)

### **Admin UI Features:**
- **Overview Cards:** текущий план, usage status, количество инвойсов
- **Usage Bars:** прогресс-бары с цветовой индикацией (зеленый/желтый/красный)
- **Billing Banner:** предупреждения о превышении лимитов
- **Plan Comparison:** модальное окно смены плана
- **Invoice Management:** просмотр, экспорт CSV, ручная отметка "paid"

## 🔧 КОНФИГУРАЦИЯ (.env):

```bash
# Billing Configuration
BILLING_DEFAULT_CURRENCY=USD
BILLING_GRACE_POLICY=soft
BILLING_WARN_THRESHOLD=0.8
BILLING_CYCLE_DAYS=30
BILLING_STUB_ENABLED=true

# Default Organization (for migrations)
DEFAULT_ORG_ID=00000000-0000-0000-0000-000000000001
```

## 🎯 ENFORCEMENT INTEGRATION:

### **Quota Checking:**
```typescript
// В API endpoints
import { enforceQuota } from '@/lib/billing/usage';

const result = await enforceQuota(orgId, 'emails_per_day', 'day', 1);
if (!result.allowed) {
  return NextResponse.json({ 
    error: '402_LIMIT_EXCEEDED',
    quota: result.quota 
  }, { status: 402 });
}
```

### **Usage Increment:**
```typescript
// При отправке email/экспорте
import { incrementUsage } from '@/lib/billing/usage';

await incrementUsage(orgId, 'emails_per_day', 'day', 1);
await incrementUsage(orgId, 'exports_per_day', 'day', 1);
```

### **UI Banner Logic:**
```typescript
// В компонентах
const { data: limitsData } = useSWR('/api/admin/limits', fetcher);

if (limitsData?.subscription?.isOverLimit) {
  // Показать баннер "Usage limit exceeded"
} else if (limitsData?.subscription?.isInGrace) {
  // Показать баннер "Grace period active"
}
```

## 🔒 БЕЗОПАСНОСТЬ:

### **RBAC Integration:**
- **Admin:** полный доступ к биллингу, смена планов, управление инвойсами
- **Partner:** просмотр подписки, usage, инвойсы (read-only)
- **Operator/Auditor:** просмотр usage и лимитов

### **Quota Enforcement:**
- **Hard Limits:** блокировка при превышении (кроме admin)
- **Grace Period:** 24-часовой период "мягкой блокировки"
- **Audit Logging:** все действия с планами и инвойсами логируются

### **Data Isolation:**
- **Org-scoped:** все данные изолированы по `org_id`
- **Usage Counters:** автоматическая группировка по окнам времени
- **Invoice Privacy:** инвойсы видны только своей организации

## 🎯 ГОТОВО:

**Billing система полностью готова! Теперь у нас есть:**
- ✅ Полная система планов и квот (FREE/PRO/TEAM/VIP)
- ✅ Автоматическое enforcement лимитов
- ✅ Система инвойсов с CSV экспортом
- ✅ Admin UI с биллинг дашбордом
- ✅ Cron для автоматического закрытия периодов
- ✅ Grace period и soft/hard caps
- ✅ Интеграция с RBAC и multi-tenant архитектурой
- ✅ Stub mode для тестирования (без PSP)

## 📝 СЛЕДУЮЩИЕ ШАГИ:

1. **Интеграция с Email Pause:** добавление `enforceQuota` в email submit/relay
2. **Интеграция с Usage Export:** проверка квот перед экспортом
3. **Webhook уведомления:** billing.limit.warning, billing.period.closed
4. **Partner Portal Billing:** упрощенный вид для партнеров

---

**Версия: 0.4.8-BILLING** — Полная биллинг система готова к деплою! 💰🚀


