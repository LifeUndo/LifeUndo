# 🔧 PATCH 0.4.3-D — **Revoke-All API-ключей + Фильтры CSV-экспорта**

## ✅ ЧТО СДЕЛАНО:

### **🚨 Revoke-All API-ключей:**
- **`src/app/api/admin/keys/revoke-all/route.ts`** - POST endpoint для деактивации всех ключей
- **`src/app/admin/keys/page.tsx`** - кнопка "Revoke ALL (аварийно)"
- **Подтверждение** перед массовой деактивацией

### **📊 CSV-экспорт с фильтрами:**
- **`src/app/api/admin/usage/export/route.ts`** - расширенные фильтры и защита от CSV-инъекций
- **`src/app/admin/usage/page.tsx`** - UI с фильтрами: endpoint, endpointLike, method, status, days
- **Выбор столбцов** и гибкие параметры экспорта

## 🧪 СМОУК-ПРОВЕРКИ:

```bash
# 1) Revoke-All (админ BasicAuth)
curl -s -u admin:****** -X POST https://getlifeundo.com/api/admin/keys/revoke-all | jq
# => { ok:true, revokedAll:true, affected:n }

# 2) Сразу после — клиенты с прежними ключами должны получать 401/403

# 3) Экспорт CSV c фильтрами
curl -I -u admin:****** "https://getlifeundo.com/api/admin/usage/export?days=7&endpointLike=/api/public&method=GET&statusMin=200&statusMax=399&limit=50000"
# => 200, content-type: text/csv

# 4) Выбор столбцов
curl -s -u admin:****** "https://getlifeundo.com/api/admin/usage/export?days=1&columns=ts,endpoint,status&limit=1000" | head
```

## 🔐 БЕЗОПАСНОСТЬ / ЗАМЕТКИ:

- **Revoke-All** мгновенно выключает все активные ключи арендатора → ожидаемо поломает интеграции
- **CSV** не содержит PII; поля экранируются и защищены от формульных CSV-инъекций
- Все админ-ручки уже закрыты BasicAuth + IP-whitelist
- Лимит экспорта по умолчанию **100 000** строк (регулируется `limit`)

## 📋 ФУНКЦИОНАЛЬНОСТЬ:

### **API ключи:**
- **GET** - получить masked ключ
- **POST** - ротировать (plaintext один раз)
- **DELETE** - деактивировать (revoke)
- **POST /revoke-all** - деактивировать ВСЕ ключи (аварийно)

### **CSV экспорт с фильтрами:**
- **Временные фильтры:** `days`, `from`, `to`
- **Endpoint фильтры:** `endpoint` (=), `endpointLike` (ILIKE)
- **HTTP фильтры:** `method`, `status`, `statusMin`, `statusMax`
- **Лимиты:** `limit` (до 100,000)
- **Столбцы:** `columns` (ts,endpoint,method,status)
- **Защита:** CSV-инъекции, экранирование

## 🎯 ГОТОВО:

**Revoke-All + Filters полностью готовы! Теперь у нас есть:**
- ✅ Аварийная деактивация всех API ключей
- ✅ Расширенные фильтры CSV экспорта
- ✅ Защита от CSV-инъекций
- ✅ Гибкий выбор столбцов
- ✅ UI с быстрыми фильтрами

---

**Хочешь добавить фильтр по статус-классу (2xx/4xx/5xx), сортировку и gzip-экспорт? Скажи: «status-class + sort + gzip — одним постом» 🚀**

