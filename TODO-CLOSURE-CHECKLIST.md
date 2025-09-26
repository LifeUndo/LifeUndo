# ✅ TODO Closure Checklist - Закрытие всех висящих задач

## 🎯 Порядок выполнения (15-30 минут):

### **1. DNS/SSL Fix (ручное действие админа)**
- [ ] **Cloudflare DNS fix** - отметь ✅ после смены записей и Purge Cache
- [ ] **Vercel SSL fix** - отметь ✅ после "Valid configuration" и 200 OK

### **2. Проверка SSL (после фикса)**
```powershell
curl.exe -I https://getlifeundo.com/
curl.exe -I https://www.getlifeundo.com/
```
**Ожидаем:** `HTTP/1.1 200 OK`, заголовки Vercel

### **3. Применение миграций**
```powershell
$env:DATABASE_URL="postgresql://USERNAME:PASSWORD@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
.\apply-migrations-ready.ps1
```
- [ ] **Применить миграции 035-038** - отметь ✅ после успешного выполнения

### **4. SQL проверка миграций**
```sql
SELECT to_regclass('public.email_relay_log');
SELECT to_regclass('public.plans');
SELECT to_regclass('public.plan_quotas');
SELECT to_regclass('public.org_subscriptions');
SELECT to_regclass('public.invoices');
```
**Ожидаем:** все запросы возвращают не NULL

### **5. Запуск SMTP сервисов**
```powershell
npm run smtp:start
npm run relay:start
```

### **6. Smoke-тест Email Pause**
- [ ] Отправить письмо на SMTP :2525
- [ ] В админке: **Approve** письмо
- [ ] Проверить: статус в `relay-log` = SENT
- [ ] **Smoke-тесты для email submit/approve/deny** - отметь ✅

### **7. Проверка System Health**
- [ ] Перейти на `/admin/system-health`
- [ ] Все 5 индикаторов должны быть зелёные

---

## ✅ Что сразу отметить "выполнено":

### **Уже готово:**
- ✅ **GitHub тэги обновлены** - v0.4.7-SMTP, v0.4.8-BILLING, v0.4.9-FUND
- ✅ **System Health Dashboard создан** - /admin/system-health с 5 индикаторами
- ✅ **PATCH 0.4.5-EP: Email Pause Gateway** - код готов
- ✅ **PATCH 0.4.6-RBAC: Роли, Тенанты** - код готов
- ✅ **PATCH 0.4.7-SMTP: SMTP Listener + Relay** - код готов
- ✅ **PATCH 0.4.8-BILLING: Полная биллинг система** - код готов
- ✅ **E2E тесты после email-pause: 2 passed** - тесты проходят
- ✅ **E2E тесты после RBAC: 2 passed** - тесты проходят
- ✅ **E2E тесты после SMTP: 2 passed** - тесты проходят
- ✅ **E2E тесты после billing: 2 passed** - тесты проходят
- ✅ **Установлены SMTP зависимости** - smtp-server, nodemailer, mailparser

### **Отметить после выполнения:**
- [ ] **Миграция 035_email_pause.sql** - после apply-migrations-ready.ps1
- [ ] **Миграция 036_rbac_multitenant.sql** - после apply-migrations-ready.ps1
- [ ] **Миграция 037_email_smtp_relay.sql** - после apply-migrations-ready.ps1
- [ ] **Миграция 038_billing_core.sql** - после apply-migrations-ready.ps1
- [ ] **Smoke-тесты для email submit/approve/deny API endpoints** - после smoke-теста
- [ ] **Smoke-тесты для API keys, webhooks, partner portal** - после проверки API
- [ ] **Smoke-тесты для billing API endpoints** - после проверки billing API
- [ ] **Cloudflare DNS fix** - после смены DNS записей
- [ ] **Vercel SSL fix** - после перевыпуска сертификата

---

## 🚀 После "зелёного" состояния:

### **Сразу переходим к PATCH 0.4.9-FUND:**
- [ ] **Email Pause MVP** - Safe-Send delay + Cancel API/UI
- [ ] **Страницы /gov, /edu, /fund** (RU/EN) с контентом
- [ ] **FundBanner компонент** - 10% revenue → GetLifeUndo Fund
- [ ] **FreeKassa e2e** - webhook → billing integration
- [ ] **Презентации для пилотов** - GLU_Pilots_2025Q4 (RU/EN, A4/16:9)

---

## 🎯 Критерии "зелёного" состояния:

### **Все должно работать:**
1. ✅ `getlifeundo.com` - HTTP 200, валидный SSL, Server: Vercel
2. ✅ `www.getlifeundo.com` - HTTP 200, Server: Vercel
3. ✅ Database - все таблицы 035-038 созданы
4. ✅ SMTP Listener - порт 2525, принимает письма
5. ✅ Email Relay - отправляет APPROVED → SENT
6. ✅ System Health - все 5 индикаторов зелёные
7. ✅ Admin Panel - /admin/billing, /admin/email, /admin/usage доступны

### **Проверочные команды:**
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

## ⏰ Время выполнения: 15-30 минут после DNS/SSL фикса

**🎉 После выполнения всех пунктов все TODO будут закрыты, и можно переходить к PATCH 0.4.9-FUND!**

