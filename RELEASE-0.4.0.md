# 🚀 Release 0.4.0 - GetLifeUndo

## ✅ Что готово:

### 🛡️ **Безопасность:**
- HSTS, CSP, X-Frame-Options headers
- Timing-safe сравнения
- Rate limiting (300 req/min)
- FreeKassa replay protection
- IP whitelist для админки

### 🔌 **API v1:**
- `/developers` - документация
- `/openapi.yaml` - OpenAPI спецификация
- Bearer токены (SHA-256)
- `/api/v1/licenses/validate`
- `/api/v1/licenses/activate`
- `/api/v1/usage`

### 🤝 **Партнерство:**
- `/partners` - партнерская программа
- Тарифы API (Dev/Pro/Team/Enterprise)
- White-Label предложения
- Реферальная программа (20% rev-share)

### 🏗️ **Инфраструктура:**
- Готовность к Cloudflare WAF/RL
- Админка с генерацией API-ключей
- Статус страница с версией
- FreeKassa webhook с защитой от дублей

## 📋 **Деплой чеклист:**

### 1. **Миграции + сидинг:**
```bash
# Сгенерировать миграции
npm run db:generate

# Применить на БД (Neon)
npm run db:migrate

# Выполнить seed.sql в Neon console
```

### 2. **Генерация API-ключа:**
```bash
curl -u "$BASIC_AUTH_USER:$BASIC_AUTH_PASS" -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"QA Key","planCode":"pro"}' \
  https://getlifeundo.com/api/admin/keys
```

### 3. **Смоук-тесты API:**
```bash
# validate
curl -X POST https://getlifeundo.com/api/v1/licenses/validate \
 -H "Authorization: Bearer <RAW>" -H "Content-Type: application/json" \
 -d '{"key":"LIFE-TEST-0000-0000"}'

# activate
curl -X POST https://getlifeundo.com/api/v1/licenses/activate \
 -H "Authorization: Bearer <RAW>" -H "Content-Type: application/json" \
 -d '{"key":"LIFE-TEST-0000-0000","deviceId":"QA-BOX-01","deviceName":"QA-PC"}'

# usage
curl -H "Authorization: Bearer <RAW>" https://getlifeundo.com/api/v1/usage
```

### 4. **FreeKassa webhook:**
- URL: `https://getlifeundo.com/api/fk/notify`
- Тест: отправка тест-нотифика
- Проверка: запись в `webhooks`, `payments`
- Дубль с тем же `intid` → `DUPLICATE`

### 5. **Cloudflare настройки:**
- WAF: блок `/admin`, `/drizzle` (кроме вашего IP)
- Rate Limit: 120 rps к `/api/*`, burst 240, ban 5m
- Page Rule: `/drizzle` → 403

### 6. **Beget переменные:**
- `NEXT_PUBLIC_APP_VERSION=0.4.0`
- `ADMIN_WHITELIST=<ваш_IP>`
- Длинный `BASIC_AUTH_PASS`

## ✅ **QA чеклист:**

- [ ] `/status` (версия 0.4.0, баннеры, 200 OK)
- [ ] `/developers`, `/openapi.yaml` (скачивается yaml)
- [ ] `/partners` (видна таблица тарифов)
- [ ] `/admin` (только по BasicAuth и/или из `ADMIN_WHITELIST`)
- [ ] `/api/_health` (200 OK)
- [ ] API v1 смоук (3 запроса выше)
- [ ] FK webhook тест и дубль с тем же `intid` → `DUPLICATE`
- [ ] БД: `plans`, `api_keys`, `licenses`, `webhooks` — записи корректны
- [ ] SSL — «закрыт» только HTTPS (редирект с http)

## 🎯 **Готово к продакшену!**

**Версия 0.4.0 готова к релизу! 🚀**


