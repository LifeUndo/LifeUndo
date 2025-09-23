# Проверка готовности к продакшену
# Использование: .\production-readiness-check.ps1 <https://project.vercel.app> <ADMIN_TOKEN>

param(
    [Parameter(Mandatory=$true)][string]$Base,
    [Parameter(Mandatory=$true)][string]$AdminToken
)

Write-Host "🎯 Проверка готовности к продакшену" -ForegroundColor Cyan
Write-Host "🔗 URL: $Base" -ForegroundColor Yellow
Write-Host ""

$allTestsPassed = $true

# Тест 1: Create endpoint
Write-Host "1️⃣ Тест: Create endpoint" -ForegroundColor Green
try {
    $createResponse = Invoke-RestMethod -Uri "$Base/api/fk/create" -Method POST -ContentType "application/json" -Headers @{"Origin"="https://lifeundo.ru"} -Body '{"email":"test@example.com","plan":"vip_lifetime","locale":"ru"}'
    
    if ($createResponse.url -and $createResponse.order_id) {
        Write-Host "✅ Create endpoint работает" -ForegroundColor Green
        Write-Host "   Order ID: $($createResponse.order_id)" -ForegroundColor Gray
        Write-Host "   URL сгенерирован: $($createResponse.url.Substring(0, [Math]::Min(50, $createResponse.url.Length)))..." -ForegroundColor Gray
    } else {
        Write-Host "❌ Create endpoint не вернул ожидаемые данные" -ForegroundColor Red
        $allTestsPassed = $false
    }
} catch {
    Write-Host "❌ Create endpoint недоступен: $($_.Exception.Message)" -ForegroundColor Red
    $allTestsPassed = $false
}

Write-Host ""

# Тест 2: Notify OPTIONS (CORS)
Write-Host "2️⃣ Тест: Notify OPTIONS (CORS)" -ForegroundColor Green
try {
    $notifyResponse = Invoke-WebRequest -Uri "$Base/api/fk/notify" -Method OPTIONS -Headers @{"Origin"="https://lifeundo.ru"}
    
    if ($notifyResponse.StatusCode -eq 204) {
        Write-Host "✅ Notify OPTIONS работает (CORS)" -ForegroundColor Green
    } else {
        Write-Host "❌ Notify OPTIONS не работает: $($notifyResponse.StatusCode)" -ForegroundColor Red
        $allTestsPassed = $false
    }
} catch {
    Write-Host "❌ Notify OPTIONS недоступен: $($_.Exception.Message)" -ForegroundColor Red
    $allTestsPassed = $false
}

Write-Host ""

# Тест 3: Админ-панель
Write-Host "3️⃣ Тест: Админ-панель" -ForegroundColor Green
try {
    $adminResponse = Invoke-RestMethod -Method Get -Uri "$Base/api/admin/orders?order_id=test" -Headers @{"Authorization"="Bearer $AdminToken"}
    
    if ($adminResponse.found) {
        Write-Host "✅ Админ-панель работает" -ForegroundColor Green
    } else {
        Write-Host "❌ Админ-панель не вернула ожидаемые данные" -ForegroundColor Red
        $allTestsPassed = $false
    }
} catch {
    Write-Host "❌ Админ-панель недоступна: $($_.Exception.Message)" -ForegroundColor Red
    $allTestsPassed = $false
}

Write-Host ""

# Тест 4: Проверка функций Vercel
Write-Host "4️⃣ Тест: Проверка функций Vercel" -ForegroundColor Green
Write-Host "   Откройте: $Base/_vercel/functions" -ForegroundColor Gray
Write-Host "   Должны быть видны: api/fk/create, api/fk/notify, api/admin/orders" -ForegroundColor Gray

Write-Host ""

# Итоговый результат
Write-Host "🎯 ИТОГОВЫЙ РЕЗУЛЬТАТ:" -ForegroundColor Cyan
if ($allTestsPassed) {
    Write-Host "✅ ВСЕ ТЕСТЫ ПРОШЛИ - ГОТОВ К ПРОДАКШЕНУ!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Следующие шаги:" -ForegroundColor Yellow
    Write-Host "1. Ротация секретов в кабинете FreeKassa" -ForegroundColor Gray
    Write-Host "2. Обновление ENV переменных в Vercel" -ForegroundColor Gray
    Write-Host "3. Redeploy Production" -ForegroundColor Gray
    Write-Host "4. Настройка Notify URL в кабинете FK" -ForegroundColor Gray
    Write-Host "5. Тест 'Проверить статус' в кабинете FK" -ForegroundColor Gray
    Write-Host "6. Живая оплата на iPhone" -ForegroundColor Gray
} else {
    Write-Host "❌ ЕСТЬ ПРОБЛЕМЫ - ТРЕБУЕТСЯ ДОРАБОТКА" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Проверьте:" -ForegroundColor Yellow
    Write-Host "- ENV переменные в Vercel" -ForegroundColor Gray
    Write-Host "- Redeploy Production" -ForegroundColor Gray
    Write-Host "- Логи Vercel на ошибки" -ForegroundColor Gray
    Write-Host "- Доступность функций" -ForegroundColor Gray
}

Write-Host ""
Write-Host "📊 Для детальной проверки запустите:" -ForegroundColor Cyan
Write-Host ".\smoke-test-freekassa.ps1 $Base" -ForegroundColor Gray
Write-Host ".\fk-notify-sim.ps1 $Base MERCHANT_ID 2490.00 LU-test-123 SECRET2" -ForegroundColor Gray
Write-Host ".\test-admin.ps1 $Base $AdminToken" -ForegroundColor Gray
