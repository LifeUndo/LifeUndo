#!/bin/bash
# Smoke Test для FreeKassa интеграции
# Использование: ./smoke-test-freekassa.sh <vercel-project-url>

set -e

VERCEL_URL="$1"
if [ -z "$VERCEL_URL" ]; then
    echo "❌ Использование: $0 <vercel-project-url>"
    echo "   Пример: $0 https://lifeundo-api.vercel.app"
    exit 1
fi

echo "🧪 Smoke Test FreeKassa Integration"
echo "🔗 Тестируем: $VERCEL_URL"
echo ""

# Тест 1: Create endpoint
echo "1️⃣ Тестирование /api/fk/create..."
CREATE_RESPONSE=$(curl -sS -X POST "$VERCEL_URL/api/fk/create" \
    -H "Content-Type: application/json" \
    -H "Origin: https://lifeundo.ru" \
    -d '{"email":"test@example.com","plan":"vip_lifetime","locale":"ru"}')

CREATE_STATUS=$?

if [ $CREATE_STATUS -eq 0 ]; then
    echo "✅ Create endpoint отвечает"
    
    # Проверяем JSON ответ
    if echo "$CREATE_RESPONSE" | jq -e '.url' > /dev/null 2>&1; then
        ORDER_ID=$(echo "$CREATE_RESPONSE" | jq -r '.order_id')
        URL=$(echo "$CREATE_RESPONSE" | jq -r '.url')
        echo "✅ JSON валиден"
        echo "   Order ID: $ORDER_ID"
        echo "   URL сгенерирован: ${URL:0:50}..."
        
        # Проверяем параметры URL
        if [[ "$URL" == https://pay.freekassa.ru/* ]]; then
            echo "✅ URL FreeKassa корректный"
        else
            echo "❌ URL FreeKassa некорректный: $URL"
        fi
    else
        echo "❌ JSON некорректен: $CREATE_RESPONSE"
    fi
else
    echo "❌ Create endpoint недоступен (curl exit code: $CREATE_STATUS)"
fi

echo ""

# Тест 2: Notify endpoint (OPTIONS)
echo "2️⃣ Тестирование /api/fk/notify (OPTIONS)..."
NOTIFY_OPTIONS=$(curl -sS -X OPTIONS "$VERCEL_URL/api/fk/notify" \
    -H "Origin: https://lifeundo.ru" \
    -w "%{http_code}")

if [[ "$NOTIFY_OPTIONS" == *"204" ]]; then
    echo "✅ Notify OPTIONS работает (CORS)"
else
    echo "❌ Notify OPTIONS не работает: $NOTIFY_OPTIONS"
fi

echo ""

# Тест 3: Проверка функций в Vercel
echo "3️⃣ Проверка функций Vercel..."
echo "   Откройте: $VERCEL_URL/_vercel/functions"
echo "   Должны быть видны: api/fk/create, api/fk/notify"

echo ""

# Итоговый чек-лист
echo "📋 Следующие шаги:"
echo "1. Ротация секретов в кабинете FreeKassa"
echo "2. Обновление ENV в Vercel:"
echo "   FK_MERCHANT_ID=<новый>"
echo "   FK_SECRET1=<новый>"
echo "   FK_SECRET2=<новый>"
echo "   ALLOWED_ORIGIN=https://lifeundo.ru"
echo "   CURRENCY=RUB"
echo "3. Redeploy Production в Vercel"
echo "4. Настройка в кабинете FK:"
echo "   Notify URL: $VERCEL_URL/api/fk/notify"
echo "   Success URL: https://lifeundo.ru/success.html"
echo "   Fail URL: https://lifeundo.ru/fail.html"
echo "5. Тест 'Проверить статус' в кабинете FK → 200"
echo "6. Живая оплата с /pricing на iPhone"

echo ""
echo "🎯 Готово к тестированию!"
