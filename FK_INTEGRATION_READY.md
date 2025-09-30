# ✅ FreeKassa Integration - ГОТОВО!

## 🎯 **PR создан**: https://github.com/LifeUndo/LifeUndo/pull/new/feature/fk-from-prod-lock

---

## 📋 **Что реализовано**

### ✅ **1. Правильная база**
- Создана ветка `feature/fk-from-prod-lock` от коммита `4f7e919` (prod-база)
- Сохранен правильный брендинг "GetLifeUndo"
- Никаких изменений в хедере/футере из старой диагностики

### ✅ **2. FreeKassa Integration**
- **ENV утилиты**: только `FREEKASSA_*` переменные (без дублирования `FK_*`)
- **API endpoints**: `/api/payments/freekassa/create` и `/result`
- **FreeKassaButton**: компонент с ENV флагом `NEXT_PUBLIC_FK_ENABLED`
- **Pricing page**: кнопки FreeKassa на Pro/VIP/Team планах

### ✅ **3. Исправления подписи**
- **Безопасный order ID**: ASCII формат без пробелов/спецсимволов
- **Правильный формат суммы**: строго `599.00` с двумя знаками
- **Явная валюта**: параметр `currency=RUB` в URL
- **Правильная подпись**: `md5(MERCHANT_ID:AMOUNT:SECRET1:ORDER_ID)`

### ✅ **4. Debug API (только Preview)**
- **`/api/debug/fk`**: возвращает статус конфигурации без секретов
- **Автоматическое отключение на проде**: 404 в production
- **Диагностические маркеры**: HTML комментарии и console логи

---

## 🔧 **ENV для Preview**

Установите в Vercel Preview Environment:

```bash
NEXT_PUBLIC_FK_ENABLED=true
FREEKASSA_MERCHANT_ID=54c3ac0581ad5eeac3fbee2ffac83f6c
FREEKASSA_SECRET1=ponOk=W5^2W9t][
FREEKASSA_SECRET2=1rF!PSuEpvj,MJL
FREEKASSA_PAYMENT_URL=https://pay.freekassa.ru/
```

**ВАЖНО**: Удалите/отключите все `FK_*` переменные, чтобы избежать конфликтов!

---

## 🧪 **Быстрая диагностика**

### **1. Найдите правильный Preview**
Используйте **git-alias** из карточки деплоя ветки `feature/fk-from-prod-lock`:
- ✅ `getlifeundo-git-feature-fk-from-prod-lock-...`

### **2. Проверьте Debug API**
```bash
curl https://<git-alias>/api/debug/fk
```
**Ожидаемо**: `{"ok":true,"fkEnabled":true,"merchantIdMasked":"54c3***"}`

### **3. Проверьте DevTools**
Откройте `/ru/pricing` → Console
**Должно быть**: `[FK] enabled=true`

### **4. Тест создания платежа**
```bash
curl -X POST https://<git-alias>/api/payments/freekassa/create \
  -H "Content-Type: application/json" \
  -d '{"productId":"getlifeundo_pro"}'
```

**Ожидаемый ответ**:
```json
{
  "ok": true,
  "pay_url": "https://pay.freekassa.ru/?m=54c3ac0581ad5eeac3fbee2ffac83f6c&oa=599.00&o=1706630400000-abc123&s=...&currency=RUB",
  "order_id": "1706630400000-abc123"
}
```

### **5. Проверьте URL**
Перейдите по `pay_url` → должна открыться форма оплаты **без ошибки "Неправильные параметры ссылки"**

---

## 🔍 **Проверка подписи (PowerShell)**

Если все еще получаете ошибку:

```powershell
$merchant = "54c3ac0581ad5eeac3fbee2ffac83f6c"
$amount = "599.00"  # Обязательно с точкой и двумя знаками!
$order = "ваш-order-id"
$secret1 = "ponOk=W5^2W9t]["

$payload = "$merchant`:$amount`:$secret1`:$order"
$md5 = New-Object System.Security.Cryptography.MD5CryptoServiceProvider
$hash = ($md5.ComputeHash([Text.Encoding]::UTF8.GetBytes($payload)) | ForEach-Object { $_.ToString("x2") }) -join ""
$signature = $hash.ToLower()

Write-Host "Expected signature: $signature"
Write-Host "Check if it matches 's' parameter in your URL"
```

---

## 🎯 **Критерии приёмки**

- [ ] `/api/debug/fk` возвращает `fkEnabled: true`
- [ ] На `/ru/pricing` видны кнопки FreeKassa
- [ ] Клик ведёт на `pay.freekassa.ru` **без ошибки**
- [ ] `/api/payments/freekassa/result` отвечает `200 YES` на валидной подписи
- [ ] Debug API недоступен на проде (404)
- [ ] Правильный брендинг "GetLifeUndo" (не "LifeUndo")

---

## 🚀 **Следующие шаги**

1. **Merge PR** → **Promote to Production** → **Protect**
2. **Установить ENV в Production** (те же ключи)
3. **Повторить smoke tests на Production**
4. **Проверить реальные платежи** через FreeKassa

**Готово к тестированию!** 🎉
