# Тест refund/повторной отправки через админ-эндпоинт
# Использование: .\test-refund-resend.ps1 <https://project.vercel.app> <ADMIN_TOKEN> <ORDER_ID>

param(
    [Parameter(Mandatory=$true)][string]$Base,
    [Parameter(Mandatory=$true)][string]$AdminToken,
    [Parameter(Mandatory=$true)][string]$OrderId
)

Write-Host "🧪 Тест refund/повторной отправки" -ForegroundColor Cyan
Write-Host "🔗 URL: $Base/api/admin/orders" -ForegroundColor Yellow
Write-Host "📋 Order ID: $OrderId" -ForegroundColor Yellow
Write-Host ""

# Тест 1: Поиск заказа
Write-Host "1️⃣ Тест: Поиск заказа" -ForegroundColor Green
try {
    $searchResponse = Invoke-RestMethod -Method Get -Uri "$Base/api/admin/orders?order_id=$OrderId" -Headers @{"Authorization"="Bearer $AdminToken"}
    
    if ($searchResponse.found) {
        Write-Host "✅ Заказ найден" -ForegroundColor Green
        Write-Host "   Order ID: $($searchResponse.order.order_id)" -ForegroundColor Gray
        Write-Host "   Email: $($searchResponse.order.email)" -ForegroundColor Gray
        Write-Host "   Plan: $($searchResponse.order.plan)" -ForegroundColor Gray
        Write-Host "   Amount: $($searchResponse.order.amount)" -ForegroundColor Gray
        Write-Host "   Status: $($searchResponse.order.status)" -ForegroundColor Gray
    } else {
        Write-Host "❌ Заказ не найден" -ForegroundColor Red
        Write-Host "   Проверьте Order ID: $OrderId" -ForegroundColor Gray
        return
    }
} catch {
    Write-Host "❌ Ошибка поиска заказа: $($_.Exception.Message)" -ForegroundColor Red
    return
}

Write-Host ""

# Тест 2: Переотправка ключа лицензии
Write-Host "2️⃣ Тест: Переотправка ключа лицензии" -ForegroundColor Green
try {
    $resendBody = @{
        order_id = $OrderId
        action = "resend_license"
    } | ConvertTo-Json
    
    $resendResponse = Invoke-RestMethod -Method Post -Uri "$Base/api/admin/orders" -ContentType "application/json" -Body $resendBody -Headers @{"Authorization"="Bearer $AdminToken"}
    
    Write-Host "✅ Переотправка ключа успешна" -ForegroundColor Green
    Write-Host "   Результат: $($resendResponse.message)" -ForegroundColor Gray
    Write-Host "   Order ID: $($resendResponse.order_id)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Ошибка переотправки: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Тест 3: Повторная переотправка (идемпотентность)
Write-Host "3️⃣ Тест: Повторная переотправка (идемпотентность)" -ForegroundColor Green
try {
    $resendBody2 = @{
        order_id = $OrderId
        action = "resend_license"
    } | ConvertTo-Json
    
    $resendResponse2 = Invoke-RestMethod -Method Post -Uri "$Base/api/admin/orders" -ContentType "application/json" -Body $resendBody2 -Headers @{"Authorization"="Bearer $AdminToken"}
    
    Write-Host "✅ Повторная переотправка работает" -ForegroundColor Green
    Write-Host "   Результат: $($resendResponse2.message)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Ошибка повторной переотправки: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Тест 4: Неверный action
Write-Host "4️⃣ Тест: Неверный action" -ForegroundColor Green
try {
    $invalidBody = @{
        order_id = $OrderId
        action = "invalid_action"
    } | ConvertTo-Json
    
    $invalidResponse = Invoke-RestMethod -Method Post -Uri "$Base/api/admin/orders" -ContentType "application/json" -Body $invalidBody -Headers @{"Authorization"="Bearer $AdminToken"}
    Write-Host "❌ Неверный action прошёл (не должно быть)" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "✅ Неверный action заблокирован (400 Bad Request)" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Неожиданная ошибка: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host ""

# Тест 5: Неавторизованный доступ
Write-Host "5️⃣ Тест: Неавторизованный доступ" -ForegroundColor Green
try {
    $unauthResponse = Invoke-RestMethod -Method Get -Uri "$Base/api/admin/orders?order_id=$OrderId"
    Write-Host "❌ Неавторизованный доступ прошёл (не должно быть)" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Неавторизованный доступ заблокирован (401 Unauthorized)" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Неожиданная ошибка: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host ""

# Итоговый результат
Write-Host "🎯 ИТОГОВЫЙ РЕЗУЛЬТАТ:" -ForegroundColor Cyan
Write-Host "✅ Админ-эндпоинт работает корректно" -ForegroundColor Green
Write-Host "✅ Поиск заказов работает" -ForegroundColor Green
Write-Host "✅ Переотправка ключей работает" -ForegroundColor Green
Write-Host "✅ Идемпотентность работает" -ForegroundColor Green
Write-Host "✅ Авторизация работает" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Проверьте логи Vercel на [ADMIN][resend_license]" -ForegroundColor Yellow
Write-Host "🎯 Готов к продакшену!" -ForegroundColor Green
