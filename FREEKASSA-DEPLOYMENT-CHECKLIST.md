# 🚀 FreeKassa Deployment Checklist

## 🚨 КРИТИЧНО: Ротация секретов

**СРОЧНО** - секреты FreeKassa были показаны в коде!

### 1. Ротация в кабинете FreeKassa
- [ ] Регенерировать `FK_SECRET1`
- [ ] Регенерировать `FK_SECRET2` 
- [ ] Регенерировать `API_KEY`
- [ ] Записать новые значения

### 2. Обновление Vercel ENV
- [ ] Project → Settings → Environment Variables
- [ ] `FK_MERCHANT_ID=<новый>`
- [ ] `FK_SECRET1=<новый>`
- [ ] `FK_SECRET2=<новый>`
- [ ] `ALLOWED_ORIGIN=https://lifeundo.ru`
- [ ] `CURRENCY=RUB` (опционально)

### 3. Redeploy
- [ ] Redeploy Production в Vercel
- [ ] Проверить функции: `https://<project>.vercel.app/_vercel/functions`

## 🔧 Настройка FreeKassa

### URLs (ВАЖНО: используйте Vercel-домен для Notify!)
- [ ] **Notify URL:** `https://<project>.vercel.app/api/fk/notify`
- [ ] **Success URL:** `https://lifeundo.ru/success.html`
- [ ] **Fail URL:** `https://lifeundo.ru/fail.html`

### Проверка статуса
- [ ] Нажать "Проверить статус" в кабинете FK
- [ ] Должен вернуть **200 OK**

## 🧪 Тестирование

### Smoke Test
```bash
# Linux/Mac
./smoke-test-freekassa.sh https://<project>.vercel.app

# Windows PowerShell
.\smoke-test-freekassa.ps1 https://<project>.vercel.app
```

### Ручное тестирование
```bash
# Тест create
curl -X POST https://<project>.vercel.app/api/fk/create \
  -H "Content-Type: application/json" \
  -H "Origin: https://lifeundo.ru" \
  -d '{"email":"test@example.com","plan":"vip_lifetime","locale":"ru"}'

# Ожидаемо: {"url":"https://pay.freekassa.ru/...","order_id":"LU-..."}
```

### Живая оплата
- [ ] Открыть `/pricing` на iPhone
- [ ] Ввести email → "Купить VIP"
- [ ] Редирект на FreeKassa
- [ ] Провести тестовую оплату
- [ ] Редирект на `/success.html`

## 📊 Мониторинг

### Логи Vercel
- [ ] Project → Functions → View Logs
- [ ] Искать `[FK][create]` - успешные создания
- [ ] Искать `[FK][notify] OK` - успешные уведомления
- [ ] НЕ должно быть `Bad signature` или `403 Forbidden`

## 🐛 Типичные ошибки

### 405 Not Allowed
- **Причина:** Notify URL указывает на статический хостинг
- **Решение:** Использовать Vercel-домен для Notify URL

### Bad signature
- **Причина:** Формула подписи не совпадает с кабинетом FK
- **Решение:** Проверить порядок полей в `buildCreateSignature`/`buildNotifySignature`

### iOS не открывает оплату
- **Причина:** Используется `window.open` вместо `location.href`
- **Решение:** Код уже исправлен, использует `location.href`

### CORS ошибки
- **Причина:** `ALLOWED_ORIGIN` не настроен
- **Решение:** Установить `ALLOWED_ORIGIN=https://lifeundo.ru`

## ✅ Готово к продакшену

После выполнения всех пунктов:
- [ ] Все тесты проходят
- [ ] Живая оплата работает на iPhone
- [ ] Логи показывают успешные уведомления
- [ ] Секреты обновлены и защищены

---

**🎯 Следующий шаг:** Провести живую оплату на iPhone после настройки!
