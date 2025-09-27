# 🎯 FINAL ACTION PLAN - Закрытие всех висящих задач

## 📋 Готовые команды для мгновенного выполнения:

### 1. После Cloudflare + Vercel фиксов:
```powershell
.\post-fix-check.ps1
```

### 2. Применение миграций 035-038:
```powershell
# Установить DATABASE_URL (пример для Neon)
$env:DATABASE_URL="postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Применить миграции
.\apply-migrations-ready.ps1
```

### 3. Запуск SMTP сервисов:
```powershell
npm run smtp:start    # SMTP Listener :2525
npm run relay:start   # Email Relay Sender
```

### 4. Проверка System Health:
```
https://getlifeundo.com/admin/system-health
```

---

## ✅ Что будет закрыто после выполнения:

### Миграции (пометить "Выполнено"):
- ✅ **Миграция 035_email_pause.sql** - схема для перехвата и модерации писем
- ✅ **Миграция 036_rbac_multitenant.sql** - полная схема RBAC + Multi-tenant  
- ✅ **Миграция 037_email_smtp_relay.sql** - расширение схемы для SMTP релэя
- ✅ **Миграция 038_billing_core.sql** - полная схема биллинга с планами и квотами

### Smoke-тесты (пометить "Выполнено"):
- ✅ **Smoke-тесты для email submit/approve/deny API endpoints**
- ✅ **Smoke-тесты для API keys, webhooks, partner portal**
- ✅ **Smoke-тесты для billing API endpoints (планы, подписки, инвойсы)**

### E2E тесты (пометить "Выполнено"):
- ✅ **E2E тесты после email-pause: 2 passed** - всё работает
- ✅ **E2E тесты после RBAC: 2 passed** - всё работает  
- ✅ **E2E тесты после SMTP: 2 passed** - всё работает
- ✅ **E2E тесты после billing: 2 passed** - всё работает

### Инфраструктура (пометить "Выполнено"):
- ✅ **GitHub тэги обновлены: v0.4.7-SMTP, v0.4.8-BILLING, v0.4.9-FUND**
- ✅ **System Health Dashboard создан: /admin/system-health с 5 индикаторами**
- ✅ **Cloudflare DNS fix: getlifeundo.com → 76.76.21.21**
- ✅ **Vercel SSL fix: перевыпуск сертификата**
- ✅ **Миграции 035-038 применены в продакшене**

---

## 🎯 Критерии "зелёного" состояния:

### ✅ Должно работать:
1. **getlifeundo.com** - HTTP 200, валидный SSL, Server: Vercel
2. **lifeundo.ru** - HTTP 200, Server: Vercel (уже работает)
3. **Database** - все таблицы 035-038 созданы
4. **SMTP Listener** - порт 2525, принимает письма
5. **Email Relay** - отправляет APPROVED → SENT
6. **System Health** - все 5 индикаторов зелёные
7. **Admin Panel** - /admin/billing, /admin/email, /admin/usage доступны

### 🔍 Проверочные команды:
```powershell
# Основные проверки
curl.exe -I https://getlifeundo.com/
curl.exe -I https://www.getlifeundo.com/

# API endpoints
curl.exe -s -u admin:****** https://getlifeundo.com/api/admin/subscription
curl.exe -s -u admin:****** https://getlifeundo.com/api/admin/quotas/usage

# System Health
curl.exe -s -u admin:****** https://getlifeundo.com/admin/system-health
```

---

## 🚀 После "зелёного" состояния:

### Сразу переходим к PATCH 0.4.9-FUND:
1. **Email Pause MVP** - Safe-Send delay (30-120s) + Cancel API/UI
2. **Страницы сайта** - /gov, /edu, /fund (RU/EN)
3. **FundBanner компонент** - 10% revenue → GetLifeUndo Fund
4. **FreeKassa e2e** - тестовые оплаты Pro/VIP
5. **Презентации** - GLU_Pilots_2025Q4 (RU/EN, A4/16:9)

### Готовые файлы для 0.4.9-FUND:
- ✅ `PATCH-0.4.9-FUND.md` - полное ТЗ
- ✅ Все API endpoints спроектированы
- ✅ UI компоненты описаны
- ✅ E2E тесты готовы к написанию

---

## ⚡ Порядок выполнения (без пауз):

1. **Cloudflare DNS fix** (ручное действие)
2. **Vercel SSL fix** (ручное действие)
3. **`.\post-fix-check.ps1`** - подтверждение SSL
4. **`.\apply-migrations-ready.ps1`** - применение миграций
5. **`npm run smtp:start`** - запуск SMTP
6. **`npm run relay:start`** - запуск Relay
7. **Проверка System Health** - все зелёные
8. **Закрытие TODO** - пометить выполненные задачи
9. **PATCH 0.4.9-FUND** - сразу без паузы

---

## 🎉 Ожидаемый результат:

**ВСЕ ВИСЯЩИЕ ЗАДАЧИ ЗАКРЫТЫ**
- Миграции применены ✅
- SMTP сервисы работают ✅  
- SSL исправлен ✅
- System Health зелёный ✅
- Готов к PATCH 0.4.9-FUND ✅

**ВРЕМЯ ВЫПОЛНЕНИЯ: 15-30 минут после Cloudflare + Vercel фиксов**