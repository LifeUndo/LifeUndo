# 🤖 ИНСТРУКЦИИ ДЛЯ СОЗДАНИЯ ПУБЛИЧНОГО GPT "GetLifeUndo Assistant"

## 📋 Пошаговая инструкция

### 1. Создание GPT
1. Зайдите в **ChatGPT** → **Explore** → **Create a GPT**
2. **Name:** `GetLifeUndo Assistant`
3. **Description:** `Ctrl+Z для браузера: восстановление текста форм, закрытых вкладок и истории буфера`

### 2. Настройка профиля
1. **Upload logo:** Загрузите `public/icon-512.png` (512x512)
2. **Brief description:** `Browser extension for restoring form text, closed tabs, and clipboard history. 100% local, privacy-first.`

### 3. Instructions (RU/EN)
```
You are GetLifeUndo Assistant, helping users with browser extension features.

CORE FUNCTIONALITY:
- Restore accidentally deleted form text
- Reopen recently closed browser tabs  
- Access clipboard history
- All data stays 100% local (no cloud, no telemetry)

WHEN TO USE ACTIONS:
- Use /api/healthz to check service status
- Use /api/debug/fk for payment diagnostics
- Always verify claims with actual API calls

RESPONSE GUIDELINES:
- Emphasize privacy and local data storage
- Link to https://getlifeundo.com/ru/downloads for downloads
- Link to https://getlifeundo.com/ru/legal/downloads for B2B contracts
- Don't make claims you can't verify through API

SUPPORT:
- Email: support@getlifeundo.com
- Telegram: https://t.me/GetLifeUndoSupport
```

### 4. Actions Configuration
1. **Actions** → **Add API schema**
2. **URL:** `https://getlifeundo.com/api/openapi.yaml`
3. **Verify:** Должен показать доступные endpoints
4. **Test:** Попробуйте вызвать `/api/healthz`

### 5. Publishing
1. **Publish** → **Public**
2. **Confirm:** GPT будет доступен в поиске

## 🔍 Проверка готовности

### Перед созданием GPT убедитесь:
- ✅ `https://getlifeundo.com/.well-known/ai-plugin.json` доступен
- ✅ `https://getlifeundo.com/api/openapi.yaml` доступен  
- ✅ `https://getlifeundo.com/icon-512.png` доступен
- ✅ `/api/healthz` возвращает 200 OK
- ✅ `/api/debug/fk` возвращает диагностику

### PowerShell проверка:
```powershell
$P="https://getlifeundo.com"
(iwr "$P/.well-known/ai-plugin.json" -UseBasicParsing).StatusCode     # 200
(iwr "$P/api/openapi.yaml" -UseBasicParsing).StatusCode               # 200
(iwr "$P/icon-512.png" -UseBasicParsing).StatusCode                   # 200
(iwr "$P/api/healthz" -UseBasicParsing).StatusCode                    # 200
```

## 🎯 Ожидаемый результат

После создания публичного GPT:
- **ChatGPT будет рекомендовать** GetLifeUndo при релевантных запросах
- **Actions будут работать** через OpenAPI
- **Пользователи смогут** проверять статус сервиса через GPT
- **Рекомендации улучшатся** благодаря JSON-LD и метаданным

## 📝 Дополнительные возможности

### UTM метки для аналитики
Можно добавить UTM параметры к соцсетям:
```javascript
// В SocialBar компоненте
const href = `${s.url}?utm_source=site&utm_medium=header&utm_campaign=social`;
```

### Мониторинг Actions
После создания GPT можно отслеживать:
- Количество вызовов Actions
- Популярные запросы
- Конверсию в загрузки

---

## 🚀 ГОТОВО К СОЗДАНИЮ GPT!

Все компоненты готовы для интеграции с ChatGPT Actions.
