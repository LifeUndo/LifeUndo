#!/usr/bin/env bash
# Эмулятор FreeKassa notify для тестирования подписей и идемпотентности
# Использование: ./fk-notify-sim.sh <https://project.vercel.app> <MERCHANT_ID> <AMOUNT> <ORDER_ID> <SECRET2>

set -euo pipefail

BASE="${1:?Usage: ./fk-notify-sim.sh <https://project.vercel.app> <MERCHANT_ID> <AMOUNT> <ORDER_ID> <SECRET2>}"
MID="${2:?MERCHANT_ID}"
AMOUNT="${3:?AMOUNT e.g. 2490.00}"
OID="${4:?ORDER_ID e.g. LU-...}"
S2="${5:?SECRET2}"

echo "🧪 Эмулятор FreeKassa notify"
echo "🔗 URL: $BASE/api/fk/notify"
echo "📋 Данные:"
echo "   Merchant ID: $MID"
echo "   Amount: $AMOUNT"
echo "   Order ID: $OID"
echo "   Secret2: ${S2:0:4}***"
echo ""

# Генерируем подпись по схеме: merchant_id:amount:secret2:order_id
SIGN=$(printf "%s:%s:%s:%s" "$MID" "$AMOUNT" "$S2" "$OID" | md5sum | awk '{print $1}')
echo "🔐 Подпись: $SIGN"
echo ""

# Отправляем POST запрос
echo "📤 Отправляем notify..."
RESPONSE=$(curl -sS -X POST "$BASE/api/fk/notify" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "MERCHANT_ID=$MID&AMOUNT=$AMOUNT&PAYMENT_ID=$OID&SIGN=$SIGN&intid=999999&us_email=test%40example.com&us_plan=vip_lifetime")

echo "📥 Ответ: $RESPONSE"
echo ""

# Проверяем статус
if [[ "$RESPONSE" == "OK" ]]; then
    echo "✅ Успешно! Проверьте логи Vercel на [FK][notify] OK"
else
    echo "❌ Ошибка! Проверьте логи Vercel"
fi

echo ""
echo "🔄 Для тестирования идемпотентности запустите команду ещё раз с теми же параметрами"
echo "   Ожидаемо: OK, но без повторной бизнес-логики в логах"
