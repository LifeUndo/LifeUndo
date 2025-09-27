# 🔧 Тест совместимости API

## **4.1 ПОДДЕРЖИВАЕМЫЕ ENDPOINTS**

### **Новые пути:**
- ✅ `/api/v1/licenses/validate`
- ✅ `/api/v1/licenses/activate`
- ✅ `/api/v1/usage`

### **Legacy пути (совместимость):**
- ✅ `/api/license/validate`
- ✅ `/api/license/activate`

## **4.2 СМОУК-ТЕСТ**

### **Legacy endpoint:**
```bash
curl -X POST https://lifeundo.ru/api/license/validate \
  -H "Authorization: Bearer <RAW_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"key":"LIFE-TEST-0000-0000"}'
```

**Ожидаемый ответ:**
```json
{
  "ok": true,
  "plan": "pro_m",
  "expiresAt": "2024-12-25T00:00:00.000Z"
}
```

### **Usage tracking:**
```bash
curl https://lifeundo.ru/api/v1/usage \
  -H "Authorization: Bearer <RAW_API_KEY>"
```

**Ожидаемый ответ:**
```json
{
  "ok": true,
  "monthCalls": 1,
  "limit": 250000,
  "remaining": 249999,
  "resetDate": "2024-02-01T00:00:00.000Z"
}
```

### **Проверка роста счетчика:**
```bash
# Сделать несколько вызовов
for i in {1..3}; do
  curl -X POST https://lifeundo.ru/api/license/validate \
    -H "Authorization: Bearer <RAW_API_KEY>" \
    -H "Content-Type: application/json" \
    -d '{"key":"LIFE-TEST-0000-0000"}'
done

# Проверить usage
curl https://lifeundo.ru/api/v1/usage \
  -H "Authorization: Bearer <RAW_API_KEY>"
```

**Ожидаемо:** `monthCalls` должен увеличиться

## **4.3 СОВМЕСТИМОСТЬ ПРИЛОЖЕНИЯ**

### **Старые сборки:**
- ✅ Используют `/api/license/*` - работают
- ✅ Получают тот же формат ответа
- ✅ Не ломаются

### **Новые сборки:**
- ✅ Используют `/api/v1/licenses/*` - работают
- ✅ Получают расширенный функционал
- ✅ Usage tracking активен

## **4.4 ТЕСТОВЫЙ КЛЮЧ**

**Используй для тестов:**
```
LIFE-TEST-0000-0000
```

**План:** `pro_m`
**Срок:** 90 дней
**Лимит устройств:** 2

## **4.5 ПРОБЛЕМЫ И РЕШЕНИЯ**

### **401 Unauthorized:**
- Проверить API ключ в заголовке Authorization
- Формат: `Bearer <RAW_API_KEY>`

### **404 Not Found:**
- Использовать правильные пути
- Проверить домен (lifeundo.ru или getlifeundo.com)

### **Приложение не работает:**
- Проверить Base URL в настройках
- Убедиться что используется правильный домен

## **4.6 ГОТОВНОСТЬ**

После прохождения тестов:
- ✅ API endpoints работают
- ✅ Legacy совместимость обеспечена
- ✅ Usage tracking активен
- ✅ Приложение готово к продакшену

**Совместимость гарантирована! 🎯**


