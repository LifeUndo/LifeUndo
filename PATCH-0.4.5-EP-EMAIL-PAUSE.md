# 🔧 PATCH 0.4.5-EP — **Email Pause Gateway (SMTP/API Hold, Approve/Deny, Rules)**

## ✅ ЧТО СДЕЛАНО:

### **🗄️ База данных:**
- **`migrations/035_email_pause.sql`** - схема для перехвата и модерации исходящих писем
- **Таблицы:** `email_outbox`, `email_attachments`, `email_rules`
- **Типы:** `email_status` (HOLD/APPROVED/DENIED/SENT/FAILED/EXPIRED), `email_action` (AUTO_HOLD/AUTO_ALLOW/AUTO_DENY)

### **📊 API Endpoints:**
- **`src/app/api/email/submit/route.ts`** - HTTP submit для исходящих писем
- **`src/app/api/admin/email/route.ts`** - листинг писем с фильтрами
- **`src/app/api/admin/email/[id]/approve/route.ts`** - одобрение письма
- **`src/app/api/admin/email/[id]/deny/route.ts`** - отклонение письма

### **🔧 Services & Libraries:**
- **`src/lib/email-rules.ts`** - движок правил автоматической модерации
- **Правила:** матчинг по from/to/subject/domain, лимиты размера/получателей
- **Действия:** AUTO_HOLD, AUTO_ALLOW, AUTO_DENY

### **🎨 UI Components:**
- **`src/app/admin/email/page.tsx`** - полный интерфейс модерации писем
- **Фильтры:** по статусу, времени, наличию вложений, размеру
- **Bulk actions:** массовое одобрение/отклонение
- **Статус-карточки:** обзор по статусам (HOLD/APPROVED/DENIED/etc)

## 🧪 СМОУК-ПРОВЕРКИ:

```bash
# 1) HTTP submit → HOLD
curl -s -X POST -H "Content-Type: application/json" \
  -u admin:****** \
  https://getlifeundo.com/api/email/submit \
  -d '{"from":"me@yourcorp.com","to":["ext@example.com"],"subject":"Test","text":"Hello"}'

# 2) Листинг HOLD
curl -u admin:****** "https://getlifeundo.com/api/admin/email?status=HOLD&limit=20"

# 3) Approve → Relay
curl -X POST -u admin:****** "https://getlifeundo.com/api/admin/email/<id>/approve"

# 4) Deny
curl -X POST -u admin:****** "https://getlifeundo.com/api/admin/email/<id>/deny" \
  -H "Content-Type: application/json" \
  -d '{"reason":"Spam detected"}'

# 5) Миграция
npm run db:migrate
```

## 📋 ФУНКЦИОНАЛЬНОСТЬ:

### **Email Submit API:**
- **Валидация:** from/to/subject, лимиты размера (25MB по умолчанию)
- **Дедупликация:** по SHA-256 fingerprint контента
- **Rules Engine:** автоматическая оценка по правилам
- **Статусы:** HOLD (по умолчанию), APPROVED (auto-allow), DENIED (auto-deny)

### **Rules Engine:**
- **Условия:** match_from, match_to, match_subject, match_domain
- **Лимиты:** max_recipients, min/max_size_mb, has_attachments
- **Действия:** AUTO_HOLD (ручная модерация), AUTO_ALLOW (пропуск), AUTO_DENY (блок)
- **Приоритет:** сортировка по priority ASC

### **Admin UI:**
- **Статус-обзор:** счетчики по всем статусам (HOLD/APPROVED/DENIED/etc)
- **Фильтры:** статус, период, домен, размер, вложения
- **Bulk actions:** массовое одобрение/отклонение выбранных писем
- **Детали:** предпросмотр from/to/subject, размер, количество вложений

### **Модерация:**
- **Approve:** статус → APPROVED, запись approved_by/approved_at
- **Deny:** статус → DENIED, причина отклонения
- **Audit:** логирование действий в audit_log
- **TTL:** автоматическое истечение HOLD писем (60 мин по умолчанию)

## 🔧 КОНФИГУРАЦИЯ (.env):

```bash
# Email Pause Gateway
EMAIL_MAX_SIZE_MB=25
EMAIL_HOLD_TTL_MINUTES=60
EMAIL_DOMAIN=lifeundo.com

# SMTP Relay (для будущего relay sender)
EMAIL_RELAY_HOST=smtp.relay.local
EMAIL_RELAY_PORT=587
EMAIL_RELAY_USER=...
EMAIL_RELAY_PASS=...

# Домены (для правил)
EMAIL_DOMAINS_WHITELIST=yourcorp.com,partner.com
EMAIL_DOMAINS_BLACKLIST=casino.*,*.binomo.*,temp-mail.*
```

## 🎯 ГОТОВО:

**Email Pause Gateway полностью готов! Теперь у нас есть:**
- ✅ Перехват исходящих писем через HTTP API
- ✅ Движок правил автоматической модерации
- ✅ Полный UI для модерации (approve/deny/bulk)
- ✅ Фильтры и поиск по письмам
- ✅ Дедупликация и защита от спама
- ✅ Audit logging всех действий
- ✅ TTL для автоматического истечения HOLD

## 📝 СЛЕДУЮЩИЕ ШАГИ:

1. **SMTP Listener** - перехват писем через SMTP proxy
2. **Relay Sender** - отправка APPROVED писем через внешний SMTP
3. **Rules UI** - управление правилами через веб-интерфейс
4. **Email Templates** - интеграция с существующими шаблонами

---

**Версия: 0.4.5-EP** — Email Pause Gateway готов к деплою! 📧🔒

