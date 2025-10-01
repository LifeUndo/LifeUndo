# Инструкции для владельца: Проверка после деплоя

## ✅ Проверка завершена - всё готово!

Все технические проверки пройдены успешно:

### 1. ✅ Путь файла правильный
```
src/app/api/dev/license/status/route.ts
```

### 2. ✅ Экспорт функции корректный
```ts
export async function GET() {
  const isPreview = process.env.VERCEL_ENV !== 'production';
  const enabled = process.env.DEV_SIMULATE_WEBHOOK_ENABLED === 'true';
  return Response.json({ enabled: isPreview && enabled });
}
```

### 3. ✅ Middleware правильно настроен
```ts
export const config = {
  matcher: ["/((?!_next|favicon.ico|api).*)"]
};
```
API пути исключены из обработки middleware.

### 4. ✅ Маршрут создался в билде
```
○ /api/dev/license/status              0 B                0 B
```
Маршрут присутствует в списке Next.js маршрутов.

---

## 🚀 Что делать сейчас

### 1. Redeploy в Vercel
1. Зайди в **Vercel Dashboard**
2. Выбери последний **Preview** деплой
3. Нажми **"Redeploy"**
4. **Обязательно** включи **"Clear build cache"** (важно после перемещения файлов)
5. Дождись завершения деплоя (2-5 минут)

### 2. Проверь API endpoints

**Подставь свой Preview-домен в команды:**

```bash
# Health check (должен вернуть "ok")
curl -sS https://getlifeundo-git-feature-app-040-alexs-projects-ef5d9b64.vercel.app/api/healthz

# Dev status (должен вернуть {"enabled":true})
curl -sS https://getlifeundo-git-feature-app-040-alexs-projects-ef5d9b64.vercel.app/api/dev/license/status
```

**Ожидаемые результаты:**
- `/api/healthz` → `ok` (200 OK)
- `/api/dev/license/status` → `{"enabled":true}` (200 OK)

### 3. Проверь страницу downloads

1. Открой: `https://getlifeundo-git-feature-app-040-alexs-projects-ef5d9b64.vercel.app/ru/downloads`
2. **Форма должна появиться** (без "Testing Disabled")
3. Введи email: `lifetests+040@getlifeundo.com`
4. Нажми **"Grant test license"**
5. После успеха нажми **"Open Account"**
6. Увидишь **Pro +180 дней** и **Starter Bonus**

---

## 🔧 Если что-то не работает

### Если `/api/dev/license/status` возвращает 404:

1. **Проверь кэш:** Сделай "Redeploy → Clear build cache" ещё раз
2. **Проверь логи билда:** В Vercel → Deployments → Logs должен быть маршрут `/api/dev/license/status`

### Если `/api/dev/license/status` возвращает `{"enabled":false}`:

**Проверь ENV переменные в Vercel Preview:**
```
DEV_SIMULATE_WEBHOOK_ENABLED=true
NEXT_EMAIL_ENABLED=false
ADMIN_GRANT_TOKEN=dev_admin_token_12345_long_random_string
```

### Если форма не появляется на `/ru/downloads`:

1. Проверь консоль браузера на ошибки
2. Убедись, что `/api/dev/license/status` возвращает `{"enabled":true}`

---

## 📊 Быстрые проверки

**Замени `<preview>` на свой домен:**

```bash
# Проверка health
curl -sS https://<preview>.vercel.app/api/healthz

# Проверка dev status
curl -sS https://<preview>.vercel.app/api/dev/license/status

# Проверка downloads страницы
curl -sS https://<preview>.vercel.app/ru/downloads | grep -i "testing disabled\|grant test license"
```

---

## 🎯 Ожидаемый результат

После успешного деплоя:

1. **API endpoints работают:**
   - `/api/healthz` → 200 OK
   - `/api/dev/license/status` → `{"enabled":true}`

2. **Страница downloads показывает форму:**
   - Нет сообщения "Testing Disabled"
   - Есть поля Email и Plan
   - Есть кнопка "Grant test license"

3. **Тест проходит полностью:**
   - Grant создаёт лицензию
   - Account показывает Pro +180 дней
   - Starter Bonus активен

---

## 📞 Если нужна помощь

Пришли:
- **Код ответа** от `/api/dev/license/status`
- **Последние 30 строк** логов билда Vercel
- **Скриншот** страницы `/ru/downloads`

И я точечно подскажу, что исправить.
