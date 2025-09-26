# 🤝 LifeUndo Partners Program

## 🎯 **Партнерские возможности**

### **API Integration**
- Проверка лицензий в реальном времени
- Активация устройств
- Webhook уведомления
- Детальная статистика использования

### **Revenue Share**
- **20%** от всех платежей в первые 12 месяцев
- Выплаты ежемесячно на банковский счет
- Минимальная сумма выплаты: 5,000 ₽

### **White-Label**
- Ваш домен и брендинг
- Наши бэкенд сервисы
- Стартовый сетап: от 50,000 ₽
- SLA поддержка: от 15,000 ₽/мес

## 📊 **Тарифы API**

| План | Вызовов/мес | Цена | Overage |
|------|-------------|------|---------|
| **Dev** (free) | 10,000 | 0 ₽ | н/д |
| **Pro** | 250,000 | 3,990 ₽ | 0.02 ₽/call |
| **Team** | 1,000,000 | 12,900 ₽ | 0.015 ₽/call |
| **Enterprise** | по запросу | — | индивидуально |

## 🚀 **Быстрый старт**

### 1. **Получить API ключ**
```bash
curl -u "admin:password" -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"MyApp","planCode":"pro"}' \
  https://getlifeundo.com/api/admin/keys
```

### 2. **JavaScript SDK**
```bash
npm install lifeundo-js
```

```javascript
import { createClient } from 'lifeundo-js';

const client = createClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://getlifeundo.com'
});

// Проверка лицензии
const result = await client.validateLicense('LIFE-XXXX-YYYY-ZZZZ');
if (result.ok) {
  console.log(`Plan: ${result.plan}, expires: ${result.expiresAt}`);
}

// Активация устройства
await client.activateLicense('LIFE-XXXX-YYYY-ZZZZ', 'device-123', 'My Computer');
```

### 3. **Python SDK**
```bash
pip install lifeundo-python
```

```python
from lifeundo import create_client

client = create_client('your-api-key')

# Проверка лицензии
result = client.validate_license('LIFE-XXXX-YYYY-ZZZZ')
if result['ok']:
    print(f"Plan: {result['plan']}, expires: {result['expiresAt']}")

# Активация устройства
client.activate_license('LIFE-XXXX-YYYY-ZZZZ', 'device-123', 'My Computer')
```

### 4. **REST API**
```bash
# Проверка лицензии
curl -X POST https://getlifeundo.com/api/v1/licenses/validate \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"key":"LIFE-XXXX-YYYY-ZZZZ"}'

# Активация устройства
curl -X POST https://getlifeundo.com/api/v1/licenses/activate \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"key":"LIFE-XXXX-YYYY-ZZZZ","deviceId":"device-123","deviceName":"My Computer"}'

# Статистика использования
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://getlifeundo.com/api/v1/usage
```

## 📚 **Документация**

- **[Developers Guide](/developers)** - Полное руководство разработчика
- **[OpenAPI Spec](/openapi.yaml)** - OpenAPI 3.0 спецификация
- **[FAQ](/faq)** - Часто задаваемые вопросы
- **[Status Page](/status)** - Статус сервисов

## 🔗 **Webhooks**

Настройте webhook URL для получения уведомлений:

```json
{
  "event": "payment.succeeded",
  "data": {
    "orderId": 12345,
    "amount": 29900,
    "currency": "RUB",
    "licenseKey": "LIFE-XXXX-YYYY-ZZZZ"
  }
}
```

**События:**
- `payment.succeeded` - Успешная оплата
- `license.issued` - Лицензия выдана
- `license.revoked` - Лицензия отозвана

## 🛡️ **Безопасность**

- **HTTPS Only** - Все запросы только по HTTPS
- **Rate Limiting** - 120 RPS для API endpoints
- **Bearer Tokens** - SHA-256 хеширование ключей
- **Replay Protection** - Защита от повторных запросов

## 📞 **Контакты**

- **Email**: partners@getlifeundo.com
- **Telegram**: @LifeUndoPartners
- **Support**: support@getlifeundo.com

## 📈 **KPI и метрики**

Мы предоставляем:
- Детальную аналитику использования API
- Статистику по конверсии лицензий
- Ежемесячные отчеты по выплатам
- Техническую поддержку 24/7

---

**Готовы стать партнером?** Свяжитесь с нами для получения персонального API ключа и настройки партнерской программы!

