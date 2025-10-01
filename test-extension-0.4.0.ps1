# Extension 0.4.0 Test Scripts (PowerShell)
# Безопасное тестирование без реальных платежей

# ===========================================
# 1) Grant Test License
# ===========================================

# Настрой переменные для своего Preview
$PREVIEW = "https://getlifeundo-git-feature-app-0-4-0-alexs-projects-ef5d9b64.vercel.app"
$TOKEN = "dev_admin_token_12345_long_random_string"
$EMAIL = "test@example.com"

Write-Host "🚀 Testing Grant API..." -ForegroundColor Green

$body = @{
    email = $EMAIL
    plan = "starter_6m"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
    "X-Admin-Token" = $TOKEN
}

try {
    $response = Invoke-RestMethod -Uri "$PREVIEW/api/dev/license/grant" -Method POST -Body $body -Headers $headers
    $response | ConvertTo-Json -Depth 3
    Write-Host "✅ Expected: { ok: true, order_id, email, level: 'pro', expires_at: ISO }" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# ===========================================
# 2) Simulate FreeKassa Webhook
# ===========================================

Write-Host "`n🔄 Testing FK Simulator..." -ForegroundColor Yellow

$ORDER_ID = "SIM-$(Get-Date -Format 'yyyyMMddHHmmss')-test"
$body = @{
    email = $EMAIL
    plan = "starter_6m"
    order_id = $ORDER_ID
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$PREVIEW/api/dev/fk/simulate" -Method POST -Body $body -Headers @{"Content-Type"="application/json"}
    $response | ConvertTo-Json -Depth 3
    Write-Host "✅ Expected: { ok: true, message: 'Webhook simulation successful' }" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# ===========================================
# 3) Check Account Page
# ===========================================

Write-Host "`n🌐 Opening Account Page..." -ForegroundColor Cyan
$accountUrl = "$PREVIEW/ru/account?email=$EMAIL"
Write-Host "URL: $accountUrl" -ForegroundColor White
Write-Host "Expected: Pro level, expires in 180 days, starter bonus active" -ForegroundColor Green

# Открыть в браузере
Start-Process $accountUrl

# ===========================================
# 4) Database Check (if you have access)
# ===========================================

Write-Host "`n📊 Database Check (run these SQL queries):" -ForegroundColor Magenta
Write-Host ""
Write-Host "-- Latest payment:" -ForegroundColor White
Write-Host "SELECT * FROM payments WHERE user_email = '$EMAIL' ORDER BY created_at DESC LIMIT 1;" -ForegroundColor Gray
Write-Host ""
Write-Host "-- License status:" -ForegroundColor White
Write-Host "SELECT * FROM licenses WHERE user_email = '$EMAIL' ORDER BY created_at DESC LIMIT 1;" -ForegroundColor Gray
Write-Host ""
Write-Host "-- Bonus flag:" -ForegroundColor White
Write-Host "SELECT * FROM feature_flags WHERE user_email = '$EMAIL' AND key='starter_bonus' ORDER BY created_at DESC LIMIT 1;" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Expected:" -ForegroundColor Green
Write-Host "  - payments.status = 'paid'" -ForegroundColor White
Write-Host "  - licenses.level = 'pro', expires_at = now() + 180 days" -ForegroundColor White
Write-Host "  - feature_flags.starter_bonus = true" -ForegroundColor White

# ===========================================
# 5) Extension Test Instructions
# ===========================================

Write-Host "`n🔧 Extension Test Instructions:" -ForegroundColor Blue
Write-Host ""
Write-Host "1. Install extension as unpacked:" -ForegroundColor White
Write-Host "   - Chrome: chrome://extensions → Developer mode → Load unpacked" -ForegroundColor Gray
Write-Host "   - Firefox: about:debugging → Load Temporary Add-on" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Open popup → Click 'License'" -ForegroundColor White
Write-Host "   Expected: Level: PRO, Active until: [date], Starter Bonus: [date]" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Test buttons:" -ForegroundColor White
Write-Host "   - Resend: sends email" -ForegroundColor Gray
Write-Host "   - Open Account: opens /ru/account" -ForegroundColor Gray
Write-Host "   - Bind: enter order_id from grant response" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Check telemetry in console:" -ForegroundColor White
Write-Host "   Expected: ext_license_viewed, ext_resend_clicked, etc." -ForegroundColor Gray

Write-Host "`n🎉 Test completed! Check email for activation message." -ForegroundColor Green
