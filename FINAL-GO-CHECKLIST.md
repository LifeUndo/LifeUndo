# 🚀 ФИНАЛЬНЫЙ GO-ЧЕК-ЛИСТ (10 минут)

## ✅ Боевая надёжность добавлена:
- **Timing-safe сравнение подписей** (защита от тайминг-атак)
- **CORS кеш** для Safari (600 сек)
- **Идемпотентность** (предотвращение дублирования)
- **Улучшенное маскирование** в логах
- **Десятичные точки** для RUB

---

## 📋 ПОШАГОВЫЙ ЧЕК-ЛИСТ:

### 1. 🔐 FreeKassa: Ротация секретов
- [ ] В кабинете FK регенерировать `SECRET1`
- [ ] В кабинете FK регенерировать `SECRET2` 
- [ ] В кабинете FK регенерировать `API_KEY`
- [ ] Записать новые значения

### 2. ⚙️ Vercel: Environment Variables
- [ ] Project → Settings → Environment Variables
- [ ] `FK_MERCHANT_ID=<новый>`
- [ ] `FK_SECRET1=<новый>`
- [ ] `FK_SECRET2=<новый>`
- [ ] `ALLOWED_ORIGIN=https://lifeundo.ru`
- [ ] `CURRENCY=RUB`
- [ ] **Redeploy Production**

### 3. 🔗 FreeKassa: Notify URL
- [ ] **Notify (POST):** `https://<project>.vercel.app/api/fk/notify`
- [ ] **Success URL:** `https://lifeundo.ru/success.html`
- [ ] **Fail URL:** `https://lifeundo.ru/fail.html`
- [ ] Нажать **"Проверить статус"** → должен вернуть **200**

### 4. 🧪 Smoke Test
```bash
# Windows PowerShell
.\smoke-test-freekassa.ps1 https://<project>.vercel.app

# macOS/Linux
bash smoke-test-freekassa.sh https://<project>.vercel.app
```
**Ожидаемо:** `create 200`, CORS ок

### 5. 📱 Живой платёж на iPhone
- [ ] Открыть `/pricing` на iPhone
- [ ] Ввести email → "Купить VIP"
- [ ] Редирект на FreeKassa
- [ ] Провести тестовую оплату
- [ ] Редирект на `/success.html`

### 6. 📊 Vercel Logs
- [ ] Project → Functions → View Logs
- [ ] Искать `[FK][notify] OK` 
- [ ] Искать `200` на `/api/fk/notify`
- [ ] НЕ должно быть `Bad signature` или `403 Forbidden`

### 7. 🔄 (Опционально) Повторная ротация
- [ ] После успешного теста регенерировать секреты ещё раз
- [ ] Обновить ENV в Vercel
- [ ] Redeploy

---

## 🐛 Если что-то сломается:

### 405 на notify
- **Причина:** Домен без серверной части
- **Решение:** Использовать Vercel-домен для Notify URL

### 403 на notify  
- **Причина:** IP-фильтр включён
- **Решение:** Временно выключить или проверить актуальные IP FK

### Bad signature
- **Причина:** Порядок полей/схема в кабинете ≠ коду
- **Решение:** Корректировать `buildCreateSignature`/`buildNotifySignature` под схему из кабинета FK

### iOS не открывает FK
- **Причина:** Используется `window.open` вместо `location.href`
- **Решение:** Код уже исправлен, использует `location.href`

---

## 📧 Мини-план выдачи лицензий (после `notify OK`):

### MVP подход:
- [ ] Google Sheet «orders» (order_id, email, plan, amount, paid_at)
- [ ] Скрипт (cloud fn/cron) ищет `paid:true` и отправляет письмо с ключом
- [ ] На `/success.html` — текст «если письма нет → поддержка»

### Продакшен подход:
- [ ] Vercel KV для идемпотентности
- [ ] SendGrid/SMTP для отправки ключей
- [ ] Автоматическая генерация лицензионных ключей

---

## 🎯 ГОТОВО К БОЮ!

После выполнения всех пунктов:
- ✅ Все тесты проходят
- ✅ Живая оплата работает на iPhone  
- ✅ Логи показывают успешные уведомления
- ✅ Секреты обновлены и защищены
- ✅ Боевая надёжность включена

**🚀 Следующий шаг:** Провести живую оплату на iPhone и получить `[FK][notify] OK` в логах!
