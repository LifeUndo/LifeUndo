# 🔧 PATCH 0.4.3-C — **Revoke API-ключа + Экспорт Usage в CSV**

## ✅ ЧТО СДЕЛАНО:

### **🔑 Revoke API-ключа:**
- **`src/app/api/admin/keys/route.ts`** - добавлен DELETE метод
- **`src/app/admin/keys/page.tsx`** - кнопка "Revoke (деактивировать)"
- **Подтверждение** перед деактивацией ключа

### **📊 Экспорт Usage в CSV:**
- **`src/app/api/admin/usage/export/route.ts`** - экспорт с параметрами days/from/to
- **`src/app/admin/usage/page.tsx`** - кнопки экспорта CSV (30 дней / 7 дней)
- **`src/app/admin/page.tsx`** - обновлена навигация

## 🧪 СМОУК-ПРОВЕРКИ:

```bash
# 1) revoke
curl -s -u admin:****** -X DELETE https://getlifeundo.com/api/admin/keys | jq
# => { "ok": true, "revoked": true }

# 2) rotate (получим plaintext один раз)
curl -s -u admin:****** -X POST https://getlifeundo.com/api/admin/keys | jq
# => { ok:true, apiKey:"lu_…", last4:"abcd" }

# 3) export CSV (30 дней)
curl -I -u admin:****** "https://getlifeundo.com/api/admin/usage/export?days=30"
# => 200 OK, content-type: text/csv, content-disposition: attachment

# 4) export CSV (точный период)
curl -I -u admin:****** "https://getlifeundo.com/api/admin/usage/export?from=2025-09-01T00:00:00Z&to=2025-09-25T23:59:59Z"
```

## 🔐 БЕЗОПАСНОСТЬ / ЗАМЕТКИ:

- **`DELETE /api/admin/keys`** отключает текущий активный ключ: все клиенты с ним начнут получать 401/403 (ожидаемо)
- **Права:** `/api/admin/*` закрыт вашим BasicAuth + IP-whitelist
- **CSV экспорт** — без PII; включает только `ts, endpoint, method, status`

## 📋 ФУНКЦИОНАЛЬНОСТЬ:

### **API ключи:**
- **GET** - получить masked ключ
- **POST** - ротировать (plaintext один раз)
- **DELETE** - деактивировать (revoke)

### **CSV экспорт:**
- **Параметры:** `days` (по умолчанию 30) или `from/to` (ISO)
- **Формат:** `ts,endpoint,method,status`
- **Лимит:** до 100,000 записей
- **Файл:** `usage_{tenant}_{from}_{to}.csv`

## 🎯 ГОТОВО:

**Revoke + CSV полностью готовы! Теперь у нас есть:**
- ✅ Деактивация API ключей без ротации
- ✅ Экспорт usage данных в CSV
- ✅ Гибкие параметры экспорта (период/дни)
- ✅ Безопасность и подтверждения

---

**Хочешь добавить "Revoke All" для аварийного отключения всех ключей и фильтры в CSV? Скажи: «revoke-all + filters — одним постом» 🚀**


