# Тест админ-панели для поиска заказов и переотправки ключей
# Использование: .\test-admin.ps1 <https://project.vercel.app> <ADMIN_TOKEN>

param(
    [Parameter(Mandatory=$true)][string]$Base,
    [Parameter(Mandatory=$true)][string]$AdminToken
)

Write-Host "🧪 Тест админ-панели" -ForegroundColor Cyan
Write-Host "🔗 URL: $Base/api/admin/orders" -ForegroundColor Yellow
Write-Host ""

# Тест 1: Поиск заказа по order_id
Write-Host "1️⃣ Тест: Поиск заказа по order_id" -ForegroundColor Green
try {
    $response1 = Invoke-RestMethod -Method Get -Uri "$Base/api/admin/orders?order_id=LU-test-123" -Headers @{"Authorization"="Bearer $AdminToken"}
    Write-Host "✅ Поиск по order_id работает" -ForegroundColor Green
    Write-Host "   Найден заказ: $($response1.order.order_id)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Ошибка поиска по order_id: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Тест 2: Поиск заказа по email
Write-Host "2️⃣ Тест: Поиск заказа по email" -ForegroundColor Green
try {
    $response2 = Invoke-RestMethod -Method Get -Uri "$Base/api/admin/orders?email=test@example.com" -Headers @{"Authorization"="Bearer $AdminToken"}
    Write-Host "✅ Поиск по email работает" -ForegroundColor Green
    Write-Host "   Найден заказ: $($response2.order.email)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Ошибка поиска по email: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Тест 3: Переотправка ключа
Write-Host "3️⃣ Тест: Переотправка ключа лицензии" -ForegroundColor Green
try {
    $body = @{
        order_id = "LU-test-123"
        action = "resend_license"
    } | ConvertTo-Json
    
    $response3 = Invoke-RestMethod -Method Post -Uri "$Base/api/admin/orders" -ContentType "application/json" -Body $body -Headers @{"Authorization"="Bearer $AdminToken"}
    Write-Host "✅ Переотправка ключа работает" -ForegroundColor Green
    Write-Host "   Результат: $($response3.message)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Ошибка переотправки: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Тест 4: Неавторизованный доступ
Write-Host "4️⃣ Тест: Неавторизованный доступ" -ForegroundColor Green
try {
    $response4 = Invoke-RestMethod -Method Get -Uri "$Base/api/admin/orders?order_id=test"
    Write-Host "❌ Неавторизованный доступ прошёл (не должно быть)" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Неавторизованный доступ заблокирован" -ForegroundColor Green
    } else {
        Write-Host "❌ Неожиданная ошибка: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎯 Тест админ-панели завершён!" -ForegroundColor Cyan
Write-Host "📊 Проверьте логи Vercel на [ADMIN][resend_license]" -ForegroundColor Yellow
