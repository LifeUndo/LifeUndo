# API Endpoints Specification

## Обзор

API LifeUndo предоставляет endpoints для управления подписками, платежами, рассылками и админ-функциями. Все endpoints используют RESTful архитектуру и возвращают JSON.

## Аутентификация

### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### JWT Token
- **Expiration**: 24 часа для пользователей, 8 часов для админов
- **Refresh**: автоматическое обновление при истечении
- **Claims**: user_id, role, permissions

## Пользовательские Endpoints

### 1. Trial Management

#### `POST /api/trial/start`
Запуск 7-дневного триала с обязательным вводом платежных данных.

**Request Body:**
```json
{
  "accountId": 123,
  "consent": true,
  "paymentToken": "tok_visa_1234567890",
  "fpHash": "sha256_hash_of_browser_fingerprint",
  "ipHash": "sha256_hash_of_ip_address"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "subscriptionId": 456,
    "trialEndsAt": "2024-02-15T10:30:00Z",
    "plan": "pro",
    "status": "trial"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": {
    "code": "TRIAL_DENIED",
    "message": "Trial already used for this card/fingerprint",
    "details": {
      "reason": "card_hash_exists",
      "lastTrialAt": "2023-12-01T00:00:00Z"
    }
  }
}
```

#### `POST /api/trial/cancel`
Отмена триала до его окончания.

**Request Body:**
```json
{
  "subscriptionId": 456
}
```

**Response:**
```json
{
  "success": true,
  "message": "Trial canceled successfully"
}
```

### 2. Subscription Management

#### `GET /api/subscription/:id`
Получение информации о подписке.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 456,
    "accountId": 123,
    "plan": "pro",
    "status": "active",
    "autoRenew": true,
    "trialEndsAt": null,
    "currentPeriodEnd": "2024-03-15T10:30:00Z",
    "nextBillAt": "2024-03-15T10:30:00Z",
    "cardBrand": "visa",
    "cardLast4": "4242"
  }
}
```

#### `POST /api/subscription/:id/cancel`
Отмена подписки.

**Request Body:**
```json
{
  "cancelAtPeriodEnd": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "canceledAt": "2024-01-15T10:30:00Z",
    "cancelAtPeriodEnd": true,
    "currentPeriodEnd": "2024-03-15T10:30:00Z"
  }
}
```

#### `POST /api/subscription/:id/update-payment`
Обновление платежного метода.

**Request Body:**
```json
{
  "paymentToken": "tok_visa_new1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "cardBrand": "visa",
    "cardLast4": "4242",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### 3. Payment History

#### `GET /api/payments`
Получение истории платежей пользователя.

**Query Parameters:**
- `limit`: количество записей (default: 20)
- `offset`: смещение (default: 0)
- `status`: фильтр по статусу

**Response:**
```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "id": 789,
        "amount": 59900,
        "currency": "RUB",
        "status": "succeeded",
        "createdAt": "2024-01-15T10:30:00Z",
        "description": "Pro subscription - January 2024"
      }
    ],
    "pagination": {
      "total": 5,
      "limit": 20,
      "offset": 0,
      "hasMore": false
    }
  }
}
```

### 4. Newsletter Management

#### `GET /api/newsletter/templates`
Получение доступных шаблонов рассылок.

**Response:**
```json
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": 1,
        "slug": "lost-thesis",
        "title": "Представьте: диплом — без резервной копии",
        "category": "education",
        "tone": "scary"
      }
    ]
  }
}
```

#### `POST /api/newsletter/schedule`
Настройка расписания рассылок для пользователя.

**Request Body:**
```json
{
  "cadenceDays": 30,
  "active": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "nextSendAt": "2024-02-15T10:30:00Z",
    "cadenceDays": 30,
    "active": true
  }
}
```

#### `POST /api/newsletter/unsubscribe`
Отписка от рассылок.

**Response:**
```json
{
  "success": true,
  "message": "Successfully unsubscribed from newsletters"
}
```

## Админские Endpoints

### 1. Authentication

#### `POST /admin/auth/login`
Вход в админ-панель.

**Request Body:**
```json
{
  "username": "admin",
  "password": "secure_password",
  "totp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "admin": {
      "id": 1,
      "username": "admin",
      "displayName": "System Administrator",
      "roles": ["admin"]
    }
  }
}
```

### 2. User Management

#### `GET /admin/users`
Получение списка пользователей с фильтрами.

**Query Parameters:**
- `search`: поиск по email/имени
- `status`: фильтр по статусу подписки
- `plan`: фильтр по плану
- `country`: фильтр по стране
- `limit`: количество записей
- `offset`: смещение

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 123,
        "email": "user@example.com",
        "displayName": "John Doe",
        "subscription": {
          "status": "active",
          "plan": "pro",
          "trialEndsAt": null,
          "currentPeriodEnd": "2024-03-15T10:30:00Z"
        },
        "createdAt": "2024-01-01T00:00:00Z",
        "lastSeenAt": "2024-01-15T10:30:00Z",
        "country": "RU",
        "source": "site"
      }
    ],
    "pagination": {
      "total": 1000,
      "limit": 20,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

#### `GET /admin/users/:id`
Детальная информация о пользователе.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "email": "user@example.com",
    "displayName": "John Doe",
    "subscription": {
      "id": 456,
      "status": "active",
      "plan": "pro",
      "autoRenew": true,
      "trialEndsAt": null,
      "currentPeriodEnd": "2024-03-15T10:30:00Z",
      "nextBillAt": "2024-03-15T10:30:00Z",
      "cardBrand": "visa",
      "cardLast4": "4242"
    },
    "payments": [
      {
        "id": 789,
        "amount": 59900,
        "status": "succeeded",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "newsletters": [
      {
        "templateId": 1,
        "templateTitle": "Lost thesis",
        "sentAt": "2024-01-10T10:30:00Z",
        "opened": true,
        "clicked": false
      }
    ],
    "riskProfile": {
      "riskScore": 10,
      "trialCount": 1,
      "lastTrialAt": "2024-01-01T00:00:00Z"
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "lastSeenAt": "2024-01-15T10:30:00Z"
  }
}
```

#### `POST /admin/users/:id/grant`
Выдача гранта пользователю.

**Request Body:**
```json
{
  "plan": "vip",
  "startsAt": "2024-01-15T00:00:00Z",
  "endsAt": "2025-01-15T00:00:00Z",
  "note": "Partner promotion"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "grantId": 101,
    "subscriptionId": 456,
    "plan": "vip",
    "startsAt": "2024-01-15T00:00:00Z",
    "endsAt": "2025-01-15T00:00:00Z"
  }
}
```

### 3. Newsletter Management

#### `GET /admin/newsletters/templates`
Получение всех шаблонов рассылок.

**Response:**
```json
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": 1,
        "slug": "lost-thesis",
        "title": "Представьте: диплом — без резервной копии",
        "body": "Template body with {user_name} placeholder",
        "locale": "ru",
        "tone": "scary",
        "category": "education",
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00Z",
        "stats": {
          "sent": 150,
          "opened": 45,
          "clicked": 8,
          "converted": 2
        }
      }
    ]
  }
}
```

#### `POST /admin/newsletters/templates`
Создание нового шаблона.

**Request Body:**
```json
{
  "slug": "new-template",
  "title": "New Template Title",
  "body": "Template body with {user_name} placeholder",
  "locale": "ru",
  "tone": "educational",
  "category": "tech"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 25,
    "slug": "new-template",
    "title": "New Template Title",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### `POST /admin/newsletters/send`
Ручная отправка рассылки.

**Request Body:**
```json
{
  "templateId": 1,
  "filters": {
    "status": "trial",
    "country": "RU",
    "source": "site"
  },
  "sendAt": "2024-01-15T12:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "jobId": "newsletter_123",
    "recipientsCount": 50,
    "estimatedSendAt": "2024-01-15T12:00:00Z"
  }
}
```

### 4. Analytics

#### `GET /admin/analytics/dashboard`
Данные для дашборда админ-панели.

**Response:**
```json
{
  "success": true,
  "data": {
    "metrics": {
      "activeSubscriptions": 1250,
      "trials": 89,
      "payments24h": 125000,
      "churnRate": 2.5,
      "arpu": 750,
      "newInstalls": 45
    },
    "charts": {
      "subscriptions": [
        { "date": "2024-01-01", "active": 1200, "trial": 100 },
        { "date": "2024-01-02", "active": 1210, "trial": 95 }
      ],
      "revenue": [
        { "date": "2024-01-01", "amount": 750000 },
        { "date": "2024-01-02", "amount": 780000 }
      ],
      "installs": [
        { "source": "site", "count": 25 },
        { "source": "amo", "count": 15 },
        { "source": "telegram", "count": 5 }
      ]
    }
  }
}
```

#### `GET /admin/analytics/revenue`
Финансовая аналитика.

**Query Parameters:**
- `period`: 7d/30d/90d/1y
- `granularity`: day/week/month

**Response:**
```json
{
  "success": true,
  "data": {
    "mrr": 750000,
    "arr": 9000000,
    "churnRate": 2.5,
    "ltv": 30000,
    "cac": 5000,
    "timeline": [
      {
        "date": "2024-01-01",
        "mrr": 750000,
        "newRevenue": 50000,
        "churnRevenue": 25000
      }
    ]
  }
}
```

### 5. Settings

#### `GET /admin/settings`
Получение настроек системы.

**Response:**
```json
{
  "success": true,
  "data": {
    "psp": {
      "provider": "stripe",
      "testMode": false,
      "webhookUrl": "https://api.lifeundo.ru/api/payments/webhook"
    },
    "email": {
      "provider": "smtp",
      "host": "smtp.gmail.com",
      "port": 587,
      "from": "noreply@lifeundo.ru"
    },
    "trial": {
      "durationDays": 7,
      "onePerCard": true,
      "onePerFingerprint": true,
      "gracePeriodHours": 72
    },
    "newsletter": {
      "defaultCadenceDays": 30,
      "maxJitterHours": 72,
      "cycleRestartMonths": 12
    }
  }
}
```

#### `PUT /admin/settings`
Обновление настроек системы.

**Request Body:**
```json
{
  "trial": {
    "durationDays": 7,
    "onePerCard": true
  },
  "newsletter": {
    "defaultCadenceDays": 30
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "updatedAt": "2024-01-15T10:30:00Z",
    "updatedBy": 1
  }
}
```

## PSP Webhook Endpoints

### `POST /api/payments/webhook`
Webhook для получения уведомлений от платежного провайдера.

**Headers:**
```
Stripe-Signature: t=1234567890,v1=signature_hash
```

**Request Body (Stripe example):**
```json
{
  "id": "evt_1234567890",
  "object": "event",
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_1234567890",
      "amount": 59900,
      "currency": "rub",
      "status": "succeeded",
      "metadata": {
        "subscription_id": "456"
      }
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Webhook processed successfully"
}
```

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {
      "field": "additional error details"
    }
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR`: ошибка валидации входных данных
- `AUTHENTICATION_REQUIRED`: требуется аутентификация
- `AUTHORIZATION_DENIED`: недостаточно прав
- `RESOURCE_NOT_FOUND`: ресурс не найден
- `TRIAL_DENIED`: триал отклонен
- `PAYMENT_FAILED`: ошибка платежа
- `RATE_LIMIT_EXCEEDED`: превышен лимит запросов
- `INTERNAL_SERVER_ERROR`: внутренняя ошибка сервера

## Rate Limiting

### Limits
- **User API**: 100 requests per minute
- **Admin API**: 1000 requests per minute
- **Webhook**: 1000 requests per minute

### Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Versioning

### URL Versioning
- Current version: `/api/v1/`
- Future versions: `/api/v2/`, `/api/v3/`

### Header Versioning
```
API-Version: 1.0
```

## Testing

### Test Environment
- **Base URL**: `https://api-test.lifeundo.ru`
- **Test Cards**: Stripe test cards
- **Test Webhooks**: ngrok for local testing

### Postman Collection
Available at: `https://api.lifeundo.ru/docs/postman-collection.json`

## Documentation

### OpenAPI Specification
Available at: `https://api.lifeundo.ru/docs/openapi.json`

### Interactive Documentation
Available at: `https://api.lifeundo.ru/docs`
