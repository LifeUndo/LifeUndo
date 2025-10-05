# Скрипт проверки деплоя GetLifeUndo
$P="https://getlifeundo.com"

Write-Host "🔍 Проверка деплоя GetLifeUndo..." -ForegroundColor Green

# ChatGPT Actions
Write-Host "`n📋 ChatGPT Actions:" -ForegroundColor Yellow
try {
    $ai = (Invoke-WebRequest "$P/.well-known/ai-plugin.json" -UseBasicParsing).StatusCode
    Write-Host "✅ ai-plugin.json: $ai" -ForegroundColor Green
} catch {
    Write-Host "❌ ai-plugin.json: $($_.Exception.Message)" -ForegroundColor Red
}

try {
    $openapi = (Invoke-WebRequest "$P/openapi.yaml" -UseBasicParsing).StatusCode  
    Write-Host "✅ openapi.yaml: $openapi" -ForegroundColor Green
} catch {
    Write-Host "❌ openapi.yaml: $($_.Exception.Message)" -ForegroundColor Red
}

# Страницы
Write-Host "`n📄 Страницы:" -ForegroundColor Yellow
$pages = @(
    "/ru/developers",
    "/ru/partners", 
    "/ru/legal/downloads",
    "/ru/downloads"
)

foreach ($page in $pages) {
    try {
        $status = (Invoke-WebRequest "$P$page" -UseBasicParsing).StatusCode
        Write-Host "✅ $page : $status" -ForegroundColor Green
    } catch {
        Write-Host "❌ $page : $($_.Exception.Message)" -ForegroundColor Red
    }
}

# AMO ссылка в downloads
Write-Host "`n🔗 AMO ссылка:" -ForegroundColor Yellow
try {
    $content = (Invoke-WebRequest "$P/ru/downloads" -UseBasicParsing).Content
    if ($content -match "addons.mozilla.org") {
        Write-Host "✅ AMO ссылка найдена" -ForegroundColor Green
    } else {
        Write-Host "❌ AMO ссылка не найдена" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Ошибка проверки downloads: $($_.Exception.Message)" -ForegroundColor Red
}

# FreeKassa API
Write-Host "`n💳 FreeKassa API:" -ForegroundColor Yellow
try {
    $body = @{productId="pro_month"} | ConvertTo-Json -Compress
    $headers = @{"Content-Type"="application/json"}
    $response = Invoke-RestMethod -Method POST -Uri "$P/api/payments/freekassa/create" -Body $body -Headers $headers
    
    if ($response.ok) {
        Write-Host "✅ FreeKassa API работает" -ForegroundColor Green
        Write-Host "   Pay URL: $($response.pay_url)" -ForegroundColor Cyan
    } else {
        Write-Host "❌ FreeKassa API ошибка: $($response.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ FreeKassa API недоступен: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 Проверка завершена!" -ForegroundColor Green
