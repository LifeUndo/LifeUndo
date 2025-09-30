# 🔍 FreeKassa Диагностика - Быстрое решение

## 🎯 **Правильный Preview URL**

Используйте **git-alias** из карточки деплоя ветки `hotfix/fk-pricing-diagnostics-01`:
- ✅ Правильный: `getlifeundo-git-hotfix-fk-pricin-...`
- ❌ Неправильный: `getlifeundo-7lh...` (случайный алиас, старый кэш)

## 🧪 **Мгновенная диагностика**

### 1. Debug API (замени `<preview>` на git-alias)
```bash
curl https://<preview>/api/debug/fk
```

**Ожидаемый ответ:**
```json
{
  "ok": true,
  "env": "preview",
  "fkEnabled": true,
  "fkConfigured": true,
  "merchantIdMasked": "54c3***",
  "paymentUrl": "https://pay.freekassa.ru/",
  "products": {
    "getlifeundo_pro": "599.00",
    "getlifeundo_vip": "9990.00",
    "getlifeundo_team": "2990.00"
  }
}
```

### 2. DevTools Console
Откройте `/ru/pricing` → DevTools → Console
**Должно быть:** `[FK] enabled=true`

### 3. Создание платежа
```bash
curl -X POST https://<preview>/api/payments/freekassa/create \
  -H "Content-Type: application/json" \
  -d '{"productId":"getlifeundo_pro"}'
```

**Ожидаемый ответ:**
```json
{
  "ok": true,
  "pay_url": "https://pay.freekassa.ru/?m=54c3ac0581ad5eeac3fbee2ffac83f6c&oa=599.00&o=...&s=...",
  "order_id": "1706630400000-abc123"
}
```

## 🔧 **Проверка подписи (PowerShell)**

Если получаете "Неправильные параметры ссылки", проверьте подпись:

```powershell
# Замените значения на те, что в вашей ссылке
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

## 🚨 **Частые причины ошибок**

1. **Неправильный Preview** → используйте git-alias, не случайный
2. **Неправильный формат суммы** → должно быть `599.00`, не `599`
3. **Неправильная подпись** → используется SECRET1 для ссылки, SECRET2 для callback
4. **Дублирующиеся ENV** → удалите `FK_*`, оставьте только `FREEKASSA_*`

## 📋 **Чек-лист для вас**

1. **Дай точный git-alias URL** из карточки деплоя
2. **Вставь JSON** из `/api/debug/fk`
3. **Пришли полный URL** `pay.freekassa.ru/?...` после клика

## 🎯 **Что я сделаю дальше**

- Проанализирую ваши данные
- Найду точную причину ошибки
- Дам финальный патч (если нужен)
- Подготовлю чек-лист для промоута

**Готов к анализу ваших данных!** 🚀
