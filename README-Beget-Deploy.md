# Деплой GetLifeUndo на Beget

## Быстрый старт

### 1. Создание Node.js приложения в Beget

1. Зайдите в панель Beget
2. Создайте новое Node.js приложение
3. Выберите версию Node.js 20.x
4. Привяжите домен `getlifeundo.com`

### 2. Настройка переменных окружения

В панели Beget → Ваше приложение → Environment Variables добавьте:

```bash
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://username:password@ep-xxx.neon.tech/getlifeundo?sslmode=require

# Basic Auth (ОБЯЗАТЕЛЬНО СМЕНИТЕ!)
BASIC_AUTH_USER=admin
BASIC_AUTH_PASS=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6

# Admin IP Whitelist
ADMIN_WHITELIST=127.0.0.1,::1,YOUR_IP_HERE

# FreeKassa
FK_MERCHANT_ID=65875
FK_SECRET1=your_secret1_here
FK_SECRET2=your_secret2_here
FK_IPS=185.71.76.0/27,185.71.77.0/27,77.220.207.0/24

# Security
JWT_SECRET=your_jwt_secret_here_32_chars_minimum
ENCRYPTION_KEY=your_32_char_encryption_key_here

# Environment
NODE_ENV=production
```

### 3. Установка зависимостей и сборка

```bash
npm install
npm run build
npm start
```

### 4. Настройка FreeKassa

В кабинете FreeKassa:
- **Notify URL:** `https://getlifeundo.com/api/fk/notify`
- **Success URL:** `https://getlifeundo.com/success`
- **Fail URL:** `https://getlifeundo.com/fail`

### 5. Настройка SSL

В Beget включите SSL для домена или подключите Cloudflare с режимом "Full (strict)".

## Проверка работы

1. **Health Check:** `https://getlifeundo.com/api/_health`
2. **Status Page:** `https://getlifeundo.com/status`
3. **Admin Panel:** `https://getlifeundo.com/admin` (требует Basic Auth)

## Безопасность

✅ **Включено:**
- Rate limiting
- IP whitelist для админки
- Security headers (HSTS, CSP, X-Frame-Options)
- Timing-safe сравнения
- Replay protection для webhooks
- Шифрование чувствительных данных

⚠️ **Обязательно:**
1. Смените все пароли из примера
2. Настройте IP whitelist для вашего админского IP
3. Включите SSL
4. Настройте мониторинг логов

## Мониторинг

- Логи: Beget → Ваше приложение → Logs
- Health check: `/api/_health`
- FreeKassa webhooks: `/api/fk/notify`

## Поддержка

При проблемах проверьте:
1. Логи приложения в Beget
2. Переменные окружения
3. Подключение к базе данных
4. SSL сертификат

