# 📊 Таблица сверки FreeKassa (ручной контроль)

## 🔍 Поля для проверки в логах/кабинете

| Поле          | Где проверяем                  | Ожидаемое значение                       | Статус |
| ------------- | ------------------------------ | ---------------------------------------- | ------ |
| `merchant_id` | лог notify + код               | == ENV `FK_MERCHANT_ID`                  | ⏳     |
| `amount`      | лог create/notify + кабинет FK | == priceMap\[plan] (с точностью 2 знака) | ⏳     |
| `order_id`    | лог create/notify + FK         | `LU-...` из create                       | ⏳     |
| `SIGN`        | код notify                     | timing-safe eq (md5 по схеме SECRET2)    | ⏳     |
| `intid`       | лог notify + кабинет FK        | сохранить для сверки/рефандов            | ⏳     |
| `email/plan`  | `us_*` в ссылке → в notify     | совпадают с фронтом                      | ⏳     |

## 🧪 Тестовые сценарии

### 1. Успешный notify
```bash
# Bash
./fk-notify-sim.sh https://project.vercel.app MERCHANT_ID 2490.00 LU-1234567890-abc123 SECRET2

# PowerShell
.\fk-notify-sim.ps1 https://project.vercel.app MERCHANT_ID 2490.00 LU-1234567890-abc123 SECRET2
```
**Ожидаемо:** `OK` + лог `[FK][notify] OK`

### 2. Идемпотентность (дублирование)
```bash
# Тот же вызов ещё раз
./fk-notify-sim.sh https://project.vercel.app MERCHANT_ID 2490.00 LU-1234567890-abc123 SECRET2
```
**Ожидаемо:** `OK`, но лог `[FK][notify] Already processed`

### 3. Неверная подпись
```bash
# С неверной суммой
./fk-notify-sim.sh https://project.vercel.app MERCHANT_ID 2489.99 LU-1234567890-abc123 SECRET2
```
**Ожидаемо:** `400 Bad signature`

### 4. Неверные поля
```bash
# Без обязательных полей
curl -X POST https://project.vercel.app/api/fk/notify \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "MERCHANT_ID=test"
```
**Ожидаемо:** `400 Bad Request`

## 📋 Чек-лист после реальной оплаты

- [ ] В логе Vercel: `[FK][notify] OK` с `order_id`, `intid`, `amount`
- [ ] Email замаскирован как `ab***@domain.com`
- [ ] Amount совпадает с суммой из create
- [ ] Order ID совпадает с create
- [ ] В кабинете FK: статус "Оплачено" с теми же данными
- [ ] В Google Sheet/CRM (если подключено): статус "Paid"

## 🐛 Типичные проблемы

### Bad signature
- **Проверить:** порядок полей в схеме подписи
- **Исправить:** `buildNotifySignature` под схему из кабинета FK

### Missing fields
- **Проверить:** Content-Type запроса (должен быть x-www-form-urlencoded)
- **Исправить:** универсальный парсер `readBody` должен работать

### Already processed
- **Нормально:** идемпотентность работает
- **Проверить:** что бизнес-логика не выполняется повторно

## 📈 Метрики для мониторинга

- **Успешные notify:** `[FK][notify] OK` в логах
- **Ошибки подписи:** `[FK][notify] bad signature`
- **Дубликаты:** `[FK][notify] Already processed`
- **Время ответа:** < 500ms для notify endpoint
