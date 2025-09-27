# ТРЕК B - Исправление getlifeundo.com (PROD)

## 🚨 КРИТИЧЕСКАЯ ПРОБЛЕМА
- DNS: `getlifeundo.com → 45.130.41.28` (старый хостинг)
- SSL: Ошибка сертификата `SEC_E_WRONG_PRINCIPAL`
- Сайт работает на nginx, но не на Vercel

## 🔧 ПЛАН ИСПРАВЛЕНИЯ

### 1. DNS Исправление (Cloudflare)
```bash
# Текущие записи (НЕПРАВИЛЬНЫЕ):
getlifeundo.com    A    45.130.41.28
www.getlifeundo.com A   45.130.41.28

# Нужно изменить на:
getlifeundo.com    A    76.76.21.21
www.getlifeundo.com CNAME cname.vercel-dns.com
```

### 2. Vercel Настройка
1. Войти в Vercel Dashboard
2. Найти проект `getlifeundo` или создать новый
3. Добавить домен `getlifeundo.com`
4. Добавить домен `www.getlifeundo.com`
5. Дождаться выдачи SSL сертификата

### 3. Проверка после исправления
```powershell
# Проверить DNS
nslookup getlifeundo.com
nslookup www.getlifeundo.com

# Проверить SSL
curl.exe -I https://getlifeundo.com/
curl.exe -I https://www.getlifeundo.com/
```

### 4. Деплой PROD версии
```powershell
# Использовать production конфиг
Copy-Item "next.config.prod.js" "next.config.js" -Force

# Установить PROD переменные
$env:NEXT_PUBLIC_ENV = "production"
$env:DATABASE_URL = "postgresql://USER:PASS@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
$env:FK_MERCHANT_ID = "<PROD_MERCHANT_ID>"
$env:FK_SECRET1 = "<PROD_SECRET1>"
$env:FK_SECRET2 = "<PROD_SECRET2>"

# Деплой
vercel --prod --name getlifeundo
```

### 5. Миграции и сервисы
```powershell
# Применить миграции
npm run db:migrate

# Запустить SMTP сервис
npm run smtp:start

# Запустить email relay
npm run relay:start
```

### 6. Smoke тесты PROD
```powershell
# Проверить основные эндпоинты
curl.exe -s https://getlifeundo.com/api/_health | jq.exe .
curl.exe -s https://getlifeundo.com/api/billing/plans | jq.exe .

# Проверить FreeKassa
.\smoke-test-freekassa.ps1 https://getlifeundo.com
```

## ⚠️ ВАЖНЫЕ ЗАМЕЧАНИЯ

1. **Не трогать lifeundo.ru** - он уже работает как DEMO
2. **Использовать PROD ключи** для FreeKassa (не тестовые)
3. **Проверить DATABASE_URL** - должен быть от админа
4. **Дождаться DNS propagation** (до 24 часов)

## 🎯 ОЖИДАЕМЫЙ РЕЗУЛЬТАТ

После исправления:
- ✅ `https://getlifeundo.com/` → 200 OK с SSL
- ✅ `https://www.getlifeundo.com/` → 200 OK с SSL  
- ✅ База данных подключена
- ✅ FreeKassa работает с PROD ключами
- ✅ SMTP и email relay запущены
- ✅ Админка доступна на `/admin`

## 📞 ЕСЛИ НУЖНА ПОМОЩЬ

1. **DNS проблемы** → обратиться к администратору Cloudflare
2. **Vercel проблемы** → проверить лимиты и настройки проекта
3. **База данных** → получить DATABASE_URL от админа
4. **FreeKassa** → проверить PROD ключи в кабинете
