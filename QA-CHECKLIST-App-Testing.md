# ✅ QA Чек-лист: Тестирование приложения

## 🚀 **Быстрая проверка (5 минут)**

### **1. Настройка Base URL**

В настройках приложения указать:
- **Base URL**: `https://getlifeundo.com/api/v1` (временно, пока .ru не исправлен)
- Или: `https://lifeundo.ru/api/v1` (после исправления домена)

### **2. Тест валидации ключа**

```bash
# Тестовый ключ из seed
curl -X POST https://getlifeundo.com/api/v1/licenses/validate \
  -H "Authorization: Bearer YOUR_API_KEY" \
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

### **3. Тест активации устройства**

```bash
curl -X POST https://getlifeundo.com/api/v1/licenses/activate \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "LIFE-TEST-0000-0000",
    "deviceId": "QA-BOX-01",
    "deviceName": "QA Test Device"
  }'
```

**Ожидаемый ответ:**
```json
{
  "ok": true,
  "plan": "pro_m",
  "expiresAt": "2024-12-25T00:00:00.000Z"
}
```

### **4. Тест usage tracking**

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://getlifeundo.com/api/v1/usage
```

**Ожидаемый ответ:**
```json
{
  "ok": true,
  "monthCalls": 2,
  "limit": 250000,
  "remaining": 249998,
  "resetDate": "2024-02-01T00:00:00.000Z"
}
```

**Проверка:** `monthCalls` должен расти после каждого API вызова.

### **5. Тест error handling**

```bash
# Неверный ключ
curl -X POST https://getlifeundo.com/api/v1/licenses/validate \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"key":"INVALID-KEY"}'
```

**Ожидаемый ответ:**
```json
{
  "ok": false
}
```

### **6. Тест совместимости (legacy endpoints)**

```bash
# Старые пути тоже должны работать
curl -X POST https://getlifeundo.com/api/license/validate \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"key":"LIFE-TEST-0000-0000"}'
```

**Ожидаемый ответ:** Тот же формат, что и `/api/v1/licenses/validate`

## 🔧 **Проверка приложения**

### **В приложении должно работать:**

1. **Валидация ключа** - показывает план и срок действия
2. **Активация устройства** - успешно активирует
3. **Повторные вызовы** - не падает, показывает "уже активировано"
4. **Ошибки сети** - показывает "повторить позже", не крашится
5. **Usage tracking** - счетчик растет после каждого вызова

### **Ожидаемое поведение:**

- ✅ **Успешная валидация** → показать план и срок
- ✅ **Успешная активация** → показать успех
- ✅ **Неверный ключ** → показать ошибку
- ✅ **Нет сети** → показать "повторить позже"
- ✅ **Rate limit** → показать "слишком много запросов"

## 🚨 **Если что-то не работает**

### **Проблема: API не отвечает**
**Решение:** Проверить Base URL в настройках приложения

### **Проблема: 401 Unauthorized**
**Решение:** Проверить API ключ в заголовке Authorization

### **Проблема: 404 Not Found**
**Решение:** Использовать правильные пути (`/api/v1/licenses/...`)

### **Проблема: Приложение падает**
**Решение:** Добавить try-catch для всех API вызовов

## 📱 **Тест на разных устройствах**

- [ ] Windows приложение
- [ ] macOS приложение  
- [ ] Linux приложение
- [ ] Мобильное приложение (если есть)

## ✅ **Критерии готовности**

- [ ] Все API endpoints отвечают корректно
- [ ] Usage tracking работает
- [ ] Error handling работает
- [ ] Приложение не падает при ошибках
- [ ] Legacy endpoints совместимы

---

**🎯 После прохождения чек-листа приложение готово к продакшену! 🚀**


