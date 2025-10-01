# Extension 0.4.0 Test Scripts
# Безопасное тестирование без реальных платежей

# ===========================================
# 1) Grant Test License (curl)
# ===========================================

# Настрой переменные для своего Preview
export PREVIEW="https://getlifeundo-git-feature-app-0-4-0-alexs-projects-ef5d9b64.vercel.app"
export TOKEN="dev_admin_token_12345_long_random_string"
export EMAIL="test@example.com"

echo "🚀 Testing Grant API..."
curl -s -X POST "$PREVIEW/api/dev/license/grant" \
  -H "Content-Type: application/json" \
  -H "X-Admin-Token: $TOKEN" \
  -d '{"email":"'"$EMAIL"'","plan":"starter_6m"}' | jq

echo ""
echo "✅ Expected: { ok: true, order_id, email, level: 'pro', expires_at: ISO }"

# ===========================================
# 2) Simulate FreeKassa Webhook
# ===========================================

echo ""
echo "🔄 Testing FK Simulator..."
ORDER_ID="SIM-$(date +%s)-test"
curl -s -X POST "$PREVIEW/api/dev/fk/simulate" \
  -H "Content-Type: application/json" \
  -d '{"email":"'"$EMAIL"'","plan":"starter_6m","order_id":"'"$ORDER_ID"'"}' | jq

echo ""
echo "✅ Expected: { ok: true, message: 'Webhook simulation successful' }"

# ===========================================
# 3) Check Account Page
# ===========================================

echo ""
echo "🌐 Opening Account Page..."
echo "URL: $PREVIEW/ru/account?email=$EMAIL"
echo "Expected: Pro level, expires in 180 days, starter bonus active"

# ===========================================
# 4) Database Check (if you have access)
# ===========================================

echo ""
echo "📊 Database Check (run these SQL queries):"
echo ""
echo "-- Latest payment:"
echo "SELECT * FROM payments WHERE user_email = '$EMAIL' ORDER BY created_at DESC LIMIT 1;"
echo ""
echo "-- License status:"
echo "SELECT * FROM licenses WHERE user_email = '$EMAIL' ORDER BY created_at DESC LIMIT 1;"
echo ""
echo "-- Bonus flag:"
echo "SELECT * FROM feature_flags WHERE user_email = '$EMAIL' AND key='starter_bonus' ORDER BY created_at DESC LIMIT 1;"
echo ""
echo "✅ Expected:"
echo "  - payments.status = 'paid'"
echo "  - licenses.level = 'pro', expires_at = now() + 180 days"
echo "  - feature_flags.starter_bonus = true"

# ===========================================
# 5) Extension Test Instructions
# ===========================================

echo ""
echo "🔧 Extension Test Instructions:"
echo ""
echo "1. Install extension as unpacked:"
echo "   - Chrome: chrome://extensions → Developer mode → Load unpacked"
echo "   - Firefox: about:debugging → Load Temporary Add-on"
echo ""
echo "2. Open popup → Click 'License'"
echo "   Expected: Level: PRO, Active until: [date], Starter Bonus: [date]"
echo ""
echo "3. Test buttons:"
echo "   - Resend: sends email"
echo "   - Open Account: opens /ru/account"
echo "   - Bind: enter order_id from grant response"
echo ""
echo "4. Check telemetry in console:"
echo "   Expected: ext_license_viewed, ext_resend_clicked, etc."

echo ""
echo "🎉 Test completed! Check email for activation message."
