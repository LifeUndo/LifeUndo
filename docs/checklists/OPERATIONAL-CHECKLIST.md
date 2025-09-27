# 🚀 Операционный чек-лист: Запуск и мониторинг

## 📋 Жёсткий порядок запуска (5 шагов)

### 1. 🔐 FreeKassa: Ротация секретов
- [ ] В кабинете FK регенерировать `SECRET1`
- [ ] В кабинете FK регенерировать `SECRET2`
- [ ] В кабинете FK регенерировать `API_KEY`
- [ ] Записать новые значения
- [ ] Сохранить снапшот ENV локально

### 2. ⚙️ Vercel: Environment Variables
- [ ] Project → Settings → Environment Variables
- [ ] `FK_MERCHANT_ID=<новый>`
- [ ] `FK_SECRET1=<новый>`
- [ ] `FK_SECRET2=<новый>`
- [ ] `ALLOWED_ORIGIN=https://lifeundo.ru`
- [ ] `CURRENCY=RUB`
- [ ] `ADMIN_TOKEN=<случайный-токен>` (для админ-панели)
- [ ] **Redeploy Production**

### 3. 🔗 FreeKassa: Notify URL
- [ ] **Notify (POST):** `https://<project>.vercel.app/api/fk/notify`
- [ ] **Success URL:** `https://lifeundo.ru/success.html`
- [ ] **Fail URL:** `https://lifeundo.ru/fail.html`
- [ ] Нажать **"Проверить статус"** → должен вернуть **200**

### 4. 🧪 Тестирование
- [ ] **Smoke Test:**
  ```bash
  # Windows
  .\smoke-test-freekassa.ps1 https://<project>.vercel.app
  
  # macOS/Linux
  bash smoke-test-freekassa.sh https://<project>.vercel.app
  ```
- [ ] **Эмулятор Notify:**
  ```bash
  # Windows
  .\fk-notify-sim.ps1 https://<project>.vercel.app MERCHANT_ID 2490.00 LU-test-123 SECRET2
  
  # macOS/Linux
  ./fk-notify-sim.sh https://<project>.vercel.app MERCHANT_ID 2490.00 LU-test-123 SECRET2
  ```
- [ ] **Негативные тесты:**
  ```bash
  ./negative-tests.sh https://<project>.vercel.app MERCHANT_ID SECRET2
  ```

### 5. 📱 Живой платёж на iPhone
- [ ] Открыть `/pricing` на iPhone
- [ ] Ввести email → "Купить VIP"
- [ ] Редирект на FreeKassa
- [ ] Провести тестовую оплату
- [ ] Редирект на `/success.html`
- [ ] Проверить логи Vercel: `[FK][notify] OK`

## 📊 Мониторинг и алерты

### Настройка алертов
- [ ] **Алерт по успешным платежам:**
  - Слово: `[FK][notify] OK`
  - Частота: < 5 в час
  - Действие: Уведомление в Telegram/почту

- [ ] **Алерт по ошибкам:**
  - Статус: 4xx/5xx на `/api/fk/notify`
  - Частота: > 3 в 10 мин
  - Действие: Уведомление в Telegram/почту

### Логи Vercel
- [ ] Включить фильтр по префиксу `FK`
- [ ] Искать: `[FK][create]`, `[FK][notify]`
- [ ] Мониторить: время ответа, ошибки, дубликаты

## 🔐 Безопасность

### Что НЕ логировать
- [ ] `SIGN` (подписи)
- [ ] Секреты (`FK_SECRET1`, `FK_SECRET2`)
- [ ] Полные email (только маскированные)

### CORS
- [ ] Кеш префлайта включён (600 сек)
- [ ] `ALLOWED_ORIGIN=https://lifeundo.ru`
- [ ] Для админ-панели добавить домен в allow-list

### IP-фильтр
- [ ] На старте оставить выключенным
- [ ] Держать актуальный список IP FK
- [ ] Проверять `x-forwarded-for` заголовки

## 🚀 Операционные процедуры

### Ротация секретов
- [ ] В кабинете FK регенерировать секреты
- [ ] Обновить ENV переменные в Vercel
- [ ] Redeploy Production
- [ ] Протестировать эмулятором notify
- [ ] Сохранить снапшот ENV локально

### Переотправка ключей
- [ ] Использовать админ-скрипт: `POST /api/admin/orders`
- [ ] Авторизация: `Authorization: Bearer <ADMIN_TOKEN>`
- [ ] Тело: `{"order_id": "LU-...", "action": "resend_license"}`

### Рефанды/чарджбеки
- [ ] Найти заказ по `intid` в логах
- [ ] Проверить статус в кабинете FK
- [ ] Обработать вручную через админ-панель
- [ ] Обновить статус в KV/DB

## 🔄 Регулярные проверки

### Ежедневно
- [ ] Проверить логи на ошибки
- [ ] Мониторить количество успешных платежей
- [ ] Проверить время ответа API

### Еженедельно
- [ ] Проверить актуальность IP-списка FK
- [ ] Очистить старые записи в KV (TTL 30 дней)
- [ ] Проверить баланс в кабинете FK

### Ежемесячно
- [ ] Ротация секретов FK
- [ ] Обновление зависимостей
- [ ] Проверка безопасности

## 📞 Контакты для эскалации

- **Техническая поддержка:** developer@lifeundo.ru
- **FreeKassa поддержка:** через кабинет FK
- **Vercel поддержка:** через dashboard

## 🎯 Критерии успеха

- [ ] Все тесты проходят
- [ ] Живая оплата работает на iPhone
- [ ] Логи показывают `[FK][notify] OK`
- [ ] Секреты обновлены и защищены
- [ ] Мониторинг настроен
- [ ] Runbook готов к использованию
