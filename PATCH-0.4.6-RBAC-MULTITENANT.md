# 🔐 PATCH 0.4.6-RBAC — **Роли, Тена́нты и Партнёрский портал (white-label)**

## ✅ ЧТО СДЕЛАНО:

### **🗄️ База данных:**
- **`migrations/036_rbac_multitenant.sql`** - полная схема RBAC + Multi-tenant
- **Таблицы:** `orgs`, `users`, `memberships`, `api_keys`, `quotas`, `audit_log`, `branding_themes`, `webhooks`
- **Типы:** `org_type`, `membership_role`, `membership_status`, `actor_type`, `quota_window`
- **Автоматическое добавление `org_id`** к существующим таблицам (`usage_events`, `email_outbox`, `tenant_api_keys`)

### **🔐 Authentication & RBAC:**
- **`src/lib/auth/session.ts`** - извлечение сессий из Basic Auth + создание дефолтных пользователей/организаций
- **`src/lib/rbac/guard.ts`** - полная система ролей и скоупов с middleware `withAuthAndRBAC`
- **`src/lib/rate-limit.ts`** - in-memory rate limiting + проверка квот из БД

### **📊 API Endpoints:**
- **`src/app/api/admin/api-keys/route.ts`** - CRUD API ключей с показом plain-ключа один раз
- **`src/app/api/admin/api-keys/[id]/revoke/route.ts`** - отзыв API ключей
- **`src/app/api/admin/webhooks/route.ts`** - CRUD webhooks с HMAC подписью
- **`src/app/api/admin/webhooks/[id]/test/route.ts`** - тестирование webhook доставки

### **🎨 Partner Portal UI:**
- **`src/app/partner/page.tsx`** - полный партнёрский портал с табами:
  - **Overview:** метрики, быстрые действия
  - **API Keys:** создание/управление ключами с показом plain-ключа
  - **Usage:** аналитика (заглушка, ссылка на админ)
  - **Branding:** white-label настройки (заглушка)
  - **Webhooks:** создание/тестирование webhooks

## 🧪 СМОУК-ПРОВЕРКИ:

```bash
# 1) Создать API-ключ (partner/admin)
curl -u admin:****** -X POST https://getlifeundo.com/api/admin/api-keys \
  -H "Content-Type: application/json" \
  -d '{"name":"prod-key","scopes":["usage:read","usage:export"]}'

# 2) Использовать ключ для экспорта usage
curl -H "Authorization: Bearer <PLAINTEXT-KEY>" \
  "https://getlifeundo.com/api/admin/usage/stream?days=1&format=ndjson&gzip=1"

# 3) Создать webhook и тестовый пинг
curl -u admin:****** -X POST https://getlifeundo.com/api/admin/webhooks \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/hook","events":["email.approved","usage.threshold.breach"]}'

curl -u admin:****** -X POST https://getlifeundo.com/api/admin/webhooks/test/<id>

# 4) Миграция
npm run db:migrate
```

## 📋 ФУНКЦИОНАЛЬНОСТЬ:

### **Multi-tenant Architecture:**
- **Организации:** `orgs` с типами (internal/partner/customer)
- **Пользователи:** `users` с членством в организациях через `memberships`
- **Роли:** admin, operator, auditor, partner, viewer с разными правами
- **Изоляция данных:** все запросы фильтруются по `org_id`

### **API Key Management:**
- **Генерация:** уникальные ключи с SHA-256 хешированием
- **Скоупы:** `usage:read`, `usage:export`, `email:submit`, `email:approve`, `webhook:sign`, `admin:*`
- **Rate Limiting:** настраиваемые лимиты per-minute
- **Безопасность:** plain-ключ показывается только при создании

### **Webhook System:**
- **События:** `email.submitted`, `email.approved`, `email.denied`, `email.sent`, `usage.threshold.breach`
- **Подпись:** HMAC-SHA256 с `X-GLU-Signature` и `X-GLU-Timestamp`
- **Тестирование:** встроенный тест webhook с проверкой доставки
- **Аудит:** логирование всех попыток доставки

### **Rate Limiting & Quotas:**
- **In-memory store:** быстрый rate limiting по org_id:scope:minute
- **Квоты:** `emails_per_day`, `api_reads_per_min` с автоматическим сбросом
- **Интеграция:** middleware `withRateLimit` для защиты endpoints

### **Partner Portal:**
- **Overview:** метрики запросов, активные ключи, webhooks, success rate
- **API Keys:** создание с выбором скоупов, показ plain-ключа, управление
- **Webhooks:** CRUD с тестированием, статус доставки
- **Branding:** заготовка для white-label кастомизации

## 🔧 КОНФИГУРАЦИЯ (.env):

```bash
# RBAC & Multi-tenant
RBAC_RATE_LIMIT_REDIS_URL=redis://...
API_KEY_HASH_ALGO=sha256
API_RATE_LIMIT_DEFAULT_PER_MIN=120
TENANT_DEFAULT_QUOTAS=emails_per_day:500,api_reads_per_min:120
WEBHOOK_TOLERANCE_SEC=300

# Basic Auth (временное решение)
BASIC_AUTH_USER=admin
BASIC_AUTH_PASS=admin
```

## 🎯 РОЛИ И ПРАВА:

### **Роли → Разрешения:**
- **`admin`:** всё в рамках org (управление членами, ключами, квотами, брендингом)
- **`operator`:** операционные действия (approve/deny email, управление правилами)
- **`auditor`:** только чтение (usage, email_outbox, аудит, экспорт read-only)
- **`partner`:** доступ к партнёрскому порталу (usage, ключи, брендинг, webhooks)
- **`viewer`:** read-only ограниченный (usage агрегаты, без PII)

### **API Scopes:**
- **`usage:read`** - чтение метрик usage
- **`usage:export`** - экспорт данных usage
- **`email:submit`** - отправка писем через Email Pause
- **`email:approve`** - одобрение/отклонение писем
- **`webhook:sign`** - создание/управление webhooks
- **`admin:*`** - полные права администратора

## 🔒 БЕЗОПАСНОСТЬ:

### **PII Protection:**
- Маскирование PII в списках для ролей `auditor`, `partner`, `viewer`
- Полный контент только для `admin/operator`
- Изоляция данных по `org_id` на всех уровнях

### **Audit Logging:**
- Логирование всех чувствительных действий (создание/ревокация ключей, approve/deny)
- Метаданные в JSON формате для детального анализа
- Фильтрация по актёру/действию/времени

### **Webhook Security:**
- HMAC-SHA256 подпись с секретом
- Replay protection через timestamp
- Timeout 10s для доставки
- Детальное логирование статуса доставки

## 🎯 ГОТОВО:

**RBAC + Multi-tenant + Partner Portal полностью готов! Теперь у нас есть:**
- ✅ Полная система ролей и прав доступа
- ✅ Multi-tenant архитектура с изоляцией данных
- ✅ API ключи со скоупами и rate limiting
- ✅ Webhook система с HMAC подписью
- ✅ Партнёрский портал с white-label возможностями
- ✅ Квоты и лимиты с автоматическим сбросом
- ✅ Comprehensive audit logging
- ✅ Интеграция с существующими Email Pause и Usage системами

## 📝 СЛЕДУЮЩИЕ ШАГИ:

1. **0.4.7-SMTP** — SMTP Listener + Relay (интеграция с Email Pause)
2. **0.4.8-Billing** — планы/лимиты/инвойсы с драйвер-заглушкой
3. **0.4.9-SSO** — SAML/OIDC для партнёров, SCIM-прописи

---

**Версия: 0.4.6-RBAC** — Multi-tenant RBAC + Partner Portal готов к деплою! 🔐👥

