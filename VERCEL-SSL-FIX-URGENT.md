# 🚨 СРОЧНО: Vercel SSL Fix для getlifeundo.com

## После обновления DNS в Cloudflare:

### 1. Vercel Dashboard:
- Перейти на https://vercel.com/dashboard
- Выбрать проект `getlifeundo`

### 2. Settings → Domains:
- Убедиться что домены добавлены:
  - `getlifeundo.com`
  - `www.getlifeundo.com`

### 3. Если домены НЕ добавлены:
- Нажать "Add Domain"
- Ввести `getlifeundo.com`
- Ввести `www.getlifeundo.com`

### 4. Обновить конфигурацию:
- Нажать "Refresh" рядом с доменом
- Дождаться статуса "Valid configuration"
- Нажать "Issue certificate" (если не автоматически)

### 5. Redeploy:
- Deployments → Latest → "Redeploy"
- Или Settings → Git → "Redeploy"

## Проверка SSL:
```bash
curl.exe -I https://getlifeundo.com/
# Должно вернуть HTTP/1.1 200 OK без SSL ошибок
```

**⏰ Время применения: 2-10 минут**

