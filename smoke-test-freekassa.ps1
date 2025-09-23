# Smoke Test для FreeKassa интеграции (PowerShell)
# Использование: .\smoke-test-freekassa.ps1 <vercel-project-url>

param(
    [Parameter(Mandatory=$true)]
    [string]$VercelUrl
)

Write-Host "🧪 Smoke Test FreeKassa Integration" -ForegroundColor Cyan
Write-Host "🔗 Тестируем: $VercelUrl" -ForegroundColor Yellow
Write-Host ""

# Тест 1: Create endpoint
Write-Host "1️⃣ Тестирование /api/fk/create..." -ForegroundColor Green

try {
    $createResponse = Invoke-RestMethod -Uri "$VercelUrl/api/fk/create" -Method POST -ContentType "application/json" -Headers @{"Origin"="https://lifeundo.ru"} -Body '{"email":"test@example.com","plan":"vip_lifetime","locale":"ru"}'
    
    Write-Host "✅ Create endpoint отвечает" -ForegroundColor Green
    
    if ($createResponse.url -and $createResponse.order_id) {
        Write-Host "✅ JSON валиден" -ForegroundColor Green
        Write-Host "   Order ID: $($createResponse.order_id)" -ForegroundColor Gray
        Write-Host "   URL сгенерирован: $($createResponse.url.Substring(0, [Math]::Min(50, $createResponse.url.Length)))..." -ForegroundColor Gray
        
        if ($createResponse.url.StartsWith("https://pay.freekassa.ru/")) {
            Write-Host "✅ URL FreeKassa корректный" -ForegroundColor Green
        } else {
            Write-Host "❌ URL FreeKassa некорректный: $($createResponse.url)" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ JSON некорректен: $($createResponse | ConvertTo-Json)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Create endpoint недоступен: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Тест 2: Notify endpoint (OPTIONS)
Write-Host "2️⃣ Тестирование /api/fk/notify (OPTIONS)..." -ForegroundColor Green

try {
    $notifyResponse = Invoke-WebRequest -Uri "$VercelUrl/api/fk/notify" -Method OPTIONS -Headers @{"Origin"="https://lifeundo.ru"}
    
    if ($notifyResponse.StatusCode -eq 204) {
        Write-Host "✅ Notify OPTIONS работает (CORS)" -ForegroundColor Green
    } else {
        Write-Host "❌ Notify OPTIONS не работает: $($notifyResponse.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Notify OPTIONS недоступен: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Тест 3: Проверка функций в Vercel
Write-Host "3️⃣ Проверка функций Vercel..." -ForegroundColor Green
Write-Host "   Откройте: $VercelUrl/_vercel/functions" -ForegroundColor Gray
Write-Host "   Должны быть видны: api/fk/create, api/fk/notify" -ForegroundColor Gray

Write-Host ""

# Итоговый чек-лист
Write-Host "📋 Следующие шаги:" -ForegroundColor Cyan
Write-Host "1. Ротация секретов в кабинете FreeKassa" -ForegroundColor Yellow
Write-Host "2. Обновление ENV в Vercel:" -ForegroundColor Yellow
Write-Host "   FK_MERCHANT_ID=<новый>" -ForegroundColor Gray
Write-Host "   FK_SECRET1=<новый>" -ForegroundColor Gray
Write-Host "   FK_SECRET2=<новый>" -ForegroundColor Gray
Write-Host "   ALLOWED_ORIGIN=https://lifeundo.ru" -ForegroundColor Gray
Write-Host "   CURRENCY=RUB" -ForegroundColor Gray
Write-Host "3. Redeploy Production в Vercel" -ForegroundColor Yellow
Write-Host "4. Настройка в кабинете FK:" -ForegroundColor Yellow
Write-Host "   Notify URL: $VercelUrl/api/fk/notify" -ForegroundColor Gray
Write-Host "   Success URL: https://lifeundo.ru/success.html" -ForegroundColor Gray
Write-Host "   Fail URL: https://lifeundo.ru/fail.html" -ForegroundColor Gray
Write-Host "5. Тест 'Проверить статус' в кабинете FK → 200" -ForegroundColor Yellow
Write-Host "6. Живая оплата с /pricing на iPhone" -ForegroundColor Yellow

Write-Host ""
Write-Host "🎯 Готово к тестированию!" -ForegroundColor Green
