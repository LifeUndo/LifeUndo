# 📧 PATCH 0.4.7-SMTP — **SMTP Listener + Relay Integration**

## ✅ ЧТО СДЕЛАНО:

### **🗄️ База данных:**
- **`migrations/037_email_smtp_relay.sql`** - расширение схемы для SMTP релэя
- **Таблица:** `email_relay_log` - логирование попыток отправки
- **Расширение `email_outbox`:** `relay_message_id`, `relay_last_attempt_at`, `relay_attempts`, `relay_next_attempt_at`, `relay_error_message`
- **Функции:** `get_relay_stats()`, `cleanup_old_relay_logs()`, триггеры для автоматического обновления статусов

### **📧 SMTP Listener:**
- **`src/services/smtp-listener.ts`** - полноценный SMTP сервер на порту 2525
- **Функциональность:** приём MAIL FROM/RCPT TO/DATA, парсинг MIME, сохранение в `email_outbox`
- **Интеграция:** с rules engine (AUTO_HOLD/AUTO_ALLOW/AUTO_DENY), дедупликация по fingerprint
- **Безопасность:** проверка размера, валидация адресов, обработка вложений

### **🚀 Relay Sender:**
- **`src/cron/email-relay.ts`** - сервис отправки APPROVED писем через внешний SMTP
- **Функциональность:** batch обработка, exponential backoff, retry logic, статистика
- **Конфигурация:** настраиваемые SMTP параметры, лимиты попыток, интервалы повтора
- **Мониторинг:** детальное логирование, метрики успеха/ошибок

### **📊 API Endpoints:**
- **`src/app/api/admin/email/[id]/relay-log/route.ts`** - история попыток отправки
- **`src/app/api/admin/email/[id]/retry/route.ts`** - ручной повтор отправки
- **`src/app/api/admin/email/[id]/force-send/route.ts`** - принудительная отправка

### **🎨 UI Updates:**
- **Обновлён `src/app/admin/email/page.tsx`** - добавлены кнопки Retry/Force Send
- **Actions:** ⚡ Force Send для APPROVED, 🔄 Retry для FAILED писем
- **Интеграция:** с существующим UI Email Pause Gateway

### **📦 Dependencies:**
- **Добавлены:** `smtp-server`, `nodemailer`, `mailparser`, `@types/*`
- **Scripts:** `smtp:start`, `relay:start`, `relay:cron` для управления сервисами

## 🧪 СМОУК-ПРОВЕРКИ:

```bash
# 1) Подключиться к SMTP Listener и отправить письмо
swaks --server localhost:2525 --from test@corp.com --to ext@example.com --data ./mail.txt

# 2) Проверить листинг HOLD
curl -u admin:****** "https://getlifeundo.com/api/admin/email?status=HOLD"

# 3) Approve и дождаться Relay → SENT
curl -X POST -u admin:****** "https://getlifeundo.com/api/admin/email/<id>/approve"

# 4) Проверить Relay Log
curl -u admin:****** "https://getlifeundo.com/api/admin/email/<id>/relay-log"

# 5) Ручной retry
curl -X POST -u admin:****** "https://getlifeundo.com/api/admin/email/<id>/retry"

# 6) Force send
curl -X POST -u admin:****** "https://getlifeundo.com/api/admin/email/<id>/force-send"

# 7) Запуск сервисов
npm run smtp:start    # SMTP Listener на порту 2525
npm run relay:start   # Relay Sender (cron)
npm run relay:cron    # Одноразовый запуск relay
```

## 📋 ФУНКЦИОНАЛЬНОСТЬ:

### **SMTP Listener (Inbound):**
- **Порт:** 2525 (настраивается через `EMAIL_SMTP_LISTEN_PORT`)
- **Протокол:** SMTP с поддержкой MAIL FROM, RCPT TO, DATA
- **Парсинг:** MIME сообщений через `mailparser`
- **Правила:** автоматическая оценка через `evaluateEmailRules`
- **Статусы:** HOLD (по умолчанию), AUTO_ALLOW, AUTO_DENY
- **Дедупликация:** по SHA-256 fingerprint контента

### **Relay Sender (Outbound):**
- **Источник:** письма со статусом APPROVED
- **SMTP:** внешний сервер (Gmail, SendGrid, etc.)
- **Retry Logic:** exponential backoff (1m, 5m, 15m, 1h)
- **Лимиты:** максимум 5 попыток (настраивается)
- **Batch:** обработка до 50 писем за раз
- **Мониторинг:** детальные логи в `email_relay_log`

### **Status Flow:**
```
HOLD → [Rules Engine] → AUTO_ALLOW/AUTO_DENY/HOLD
APPROVED → [Relay Sender] → SENT/FAILED/RETRY
FAILED → [Manual Retry] → APPROVED → SENT
```

### **API Extensions:**
- **Relay Log:** полная история попыток с кодами ответов
- **Retry:** ручной повтор отправки с проверкой лимитов
- **Force Send:** немедленная отправка в обход retry logic
- **Statistics:** метрики успеха, ошибок, времени доставки

### **UI Enhancements:**
- **Action Buttons:** ✓ Approve, ✗ Deny, ⚡ Force Send, 🔄 Retry
- **Status Indicators:** цветовая индикация статусов
- **Tooltips:** подсказки для действий
- **Integration:** с существующим Email Pause интерфейсом

## 🔧 КОНФИГУРАЦИЯ (.env):

```bash
# SMTP Listener
EMAIL_SMTP_LISTEN_PORT=2525
EMAIL_SMTP_LISTEN_HOST=0.0.0.0
EMAIL_MAX_SIZE_MB=25
DEFAULT_ORG_ID=00000000-0000-0000-0000-000000000001

# SMTP Relay
EMAIL_RELAY_HOST=smtp.gmail.com
EMAIL_RELAY_PORT=587
EMAIL_RELAY_USER=your-email@gmail.com
EMAIL_RELAY_PASS=your-app-password
EMAIL_RELAY_TLS=true
EMAIL_RELAY_MAX_ATTEMPTS=5
EMAIL_RELAY_BACKOFF=60,300,900,3600

# Email Pause
EMAIL_HOLD_TTL_MINUTES=60
EMAIL_DOMAIN=lifeundo.com
```

## 🎯 АРХИТЕКТУРА:

### **SMTP Listener Service:**
- **Класс:** `EmailSMTPListener` с настраиваемыми параметрами
- **События:** onConnect, onMailFrom, onRcptTo, onData
- **Обработка:** парсинг MIME, валидация, rules engine, сохранение в БД
- **Ответы:** 250 Queued, 550 Denied, 451 Temporary failure

### **Relay Sender Service:**
- **Класс:** `EmailRelayService` с nodemailer транспортом
- **Методы:** `processPendingEmails()`, `forceSendEmail()`, `getRelayStats()`
- **Backoff:** настраиваемые интервалы повтора
- **Pooling:** до 5 соединений, 100 сообщений на соединение

### **Database Integration:**
- **Triggers:** автоматическое обновление статусов после relay attempts
- **Functions:** статистика, очистка старых логов
- **Indexes:** оптимизация для поиска готовых к отправке писем

## 🔒 БЕЗОПАСНОСТЬ:

### **SMTP Security:**
- **Size Limits:** защита от больших файлов (25MB по умолчанию)
- **Address Validation:** проверка формата email адресов
- **Rate Limiting:** защита от спама (через существующий rate-limit middleware)
- **TLS:** поддержка STARTTLS (отключено для демо)

### **Relay Security:**
- **Authentication:** SMTP auth с username/password
- **Connection Pooling:** ограничение количества соединений
- **Error Handling:** безопасная обработка ошибок без утечки данных
- **Audit Logging:** все действия логируются в audit_log

## 🎯 ГОТОВО:

**SMTP Listener + Relay Integration полностью готов! Теперь у нас есть:**
- ✅ Полноценный SMTP сервер для приёма писем
- ✅ Автоматический relay sender с retry logic
- ✅ Полная интеграция с Email Pause Gateway
- ✅ UI для управления retry/force send
- ✅ Детальное логирование и статистика
- ✅ Настраиваемые параметры SMTP и retry
- ✅ Graceful shutdown и error handling
- ✅ Production-ready архитектура

## 📝 СЛЕДУЮЩИЕ ШАГИ:

1. **0.4.8-Billing** — планы/лимиты/инвойсы с драйвер-заглушкой
2. **0.4.9-SSO** — SAML/OIDC для партнёров, SCIM-прописи
3. **0.4.10-Monitoring** — расширенный мониторинг, алерты, дашборды

---

**Версия: 0.4.7-SMTP** — SMTP Listener + Relay готов к деплою! 📧🚀

