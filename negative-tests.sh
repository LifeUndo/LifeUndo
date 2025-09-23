#!/usr/bin/env bash
# Негативные тесты FreeKassa для проверки обработки ошибок
# Использование: ./negative-tests.sh <https://project.vercel.app> <MERCHANT_ID> <SECRET2>

set -euo pipefail

BASE="${1:?Usage: ./negative-tests.sh <https://project.vercel.app> <MERCHANT_ID> <SECRET2>}"
MID="${2:?MERCHANT_ID}"
S2="${3:?SECRET2}"

echo "🧪 Негативные тесты FreeKassa"
echo "🔗 URL: $BASE/api/fk/notify"
echo ""

# Тест 1: Неверная сумма (Bad signature)
echo "1️⃣ Тест: Неверная сумма (Bad signature)"
OID1="LU-$(date +%s)-test1"
AMOUNT_WRONG="2489.99"  # Неверная сумма
SIGN_WRONG=$(printf "%s:%s:%s:%s" "$MID" "$AMOUNT_WRONG" "$S2" "$OID1" | md5sum | awk '{print $1}')

RESPONSE1=$(curl -sS -X POST "$BASE/api/fk/notify" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "MERCHANT_ID=$MID&AMOUNT=$AMOUNT_WRONG&PAYMENT_ID=$OID1&SIGN=$SIGN_WRONG&intid=999999&us_email=test%40example.com&us_plan=vip_lifetime")

if [[ "$RESPONSE1" == "Bad signature" ]]; then
    echo "✅ Тест 1 пройден: Bad signature"
else
    echo "❌ Тест 1 провален: $RESPONSE1"
fi
echo ""

# Тест 2: Двойной notify (идемпотентность)
echo "2️⃣ Тест: Двойной notify (идемпотентность)"
OID2="LU-$(date +%s)-test2"
AMOUNT_CORRECT="2490.00"
SIGN_CORRECT=$(printf "%s:%s:%s:%s" "$MID" "$AMOUNT_CORRECT" "$S2" "$OID2" | md5sum | awk '{print $1}')

# Первый вызов
RESPONSE2A=$(curl -sS -X POST "$BASE/api/fk/notify" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "MERCHANT_ID=$MID&AMOUNT=$AMOUNT_CORRECT&PAYMENT_ID=$OID2&SIGN=$SIGN_CORRECT&intid=999999&us_email=test%40example.com&us_plan=vip_lifetime")

# Второй вызов (тот же order_id)
RESPONSE2B=$(curl -sS -X POST "$BASE/api/fk/notify" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "MERCHANT_ID=$MID&AMOUNT=$AMOUNT_CORRECT&PAYMENT_ID=$OID2&SIGN=$SIGN_CORRECT&intid=999999&us_email=test%40example.com&us_plan=vip_lifetime")

if [[ "$RESPONSE2A" == "OK" && "$RESPONSE2B" == "OK" ]]; then
    echo "✅ Тест 2 пройден: Идемпотентность работает"
else
    echo "❌ Тест 2 провален: $RESPONSE2A, $RESPONSE2B"
fi
echo ""

# Тест 3: POST без обязательных полей
echo "3️⃣ Тест: POST без обязательных полей"
RESPONSE3=$(curl -sS -X POST "$BASE/api/fk/notify" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "MERCHANT_ID=$MID")

if [[ "$RESPONSE3" == "Bad Request" ]]; then
    echo "✅ Тест 3 пройден: Bad Request"
else
    echo "❌ Тест 3 провален: $RESPONSE3"
fi
echo ""

# Тест 4: Неверный Content-Type
echo "4️⃣ Тест: Неверный Content-Type"
RESPONSE4=$(curl -sS -X POST "$BASE/api/fk/notify" \
  -H "Content-Type: application/json" \
  -d '{"MERCHANT_ID":"test","AMOUNT":"100","PAYMENT_ID":"test","SIGN":"test"}')

if [[ "$RESPONSE4" == "Bad Request" ]]; then
    echo "✅ Тест 4 пройден: Bad Request (JSON не поддерживается)"
else
    echo "❌ Тест 4 провален: $RESPONSE4"
fi
echo ""

echo "🎯 Все негативные тесты завершены!"
echo "📊 Проверьте логи Vercel на соответствующие сообщения об ошибках"
