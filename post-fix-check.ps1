# Быстрая проверка после Cloudflare + Vercel фиксов

Write-Host "🔍 Post-Fix Check - Проверка после DNS/SSL фиксов" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# 1. Проверка getlifeundo.com
Write-Host "`n1. Проверка getlifeundo.com..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "https://getlifeundo.com/" -Method Head -TimeoutSec 10 -UseBasicParsing
    Write-Host "✅ HTTPS: $($response.StatusCode) $($response.StatusDescription)" -ForegroundColor Green
    Write-Host "   Server: $($response.Headers.Server)" -ForegroundColor Gray
    Write-Host "   SSL: ВАЛИДНЫЙ" -ForegroundColor Green
} catch {
    Write-Host "❌ HTTPS Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Требуется Cloudflare DNS fix" -ForegroundColor Yellow
}

# 2. Проверка www.getlifeundo.com
Write-Host "`n2. Проверка www.getlifeundo.com..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "https://www.getlifeundo.com/" -Method Head -TimeoutSec 10 -UseBasicParsing
    Write-Host "✅ HTTPS: $($response.StatusCode) $($response.StatusDescription)" -ForegroundColor Green
    Write-Host "   Server: $($response.Headers.Server)" -ForegroundColor Gray
} catch {
    Write-Host "❌ HTTPS Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. DNS проверка
Write-Host "`n3. DNS проверка..." -ForegroundColor Blue
try {
    $dns = nslookup getlifeundo.com 8.8.8.8
    if ($dns -match "Address:\s+(\d+\.\d+\.\d+\.\d+)") {
        $ip = $matches[1]
        Write-Host "   IP: $ip" -ForegroundColor Gray
        if ($ip -eq "76.76.21.21") {
            Write-Host "   ✅ Правильный Vercel IP" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Должен быть 76.76.21.21" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "❌ DNS Error" -ForegroundColor Red
}

# 4. Проверка новых страниц
Write-Host "`n4. Проверка новых страниц..." -ForegroundColor Blue
$pages = @("/fund", "/gov", "/edu")
foreach ($page in $pages) {
    try {
        $response = Invoke-WebRequest -Uri "https://getlifeundo.com$page" -Method Head -TimeoutSec 10 -UseBasicParsing
        Write-Host "✅ $page: $($response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  $page: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# 5. Итоговый статус
Write-Host "`n🎯 ИТОГОВЫЙ СТАТУС:" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green

try {
    $healthCheck = Invoke-WebRequest -Uri "https://getlifeundo.com/" -Method Head -TimeoutSec 5 -UseBasicParsing
    if ($healthCheck.StatusCode -eq 200) {
        Write-Host "getlifeundo.com РАБОТАЕТ!" -ForegroundColor Green
        Write-Host "SSL сертификат валидный" -ForegroundColor Green
        Write-Host "Готово к применению миграций" -ForegroundColor Green
        Write-Host "`nСЛЕДУЮЩИЙ ШАГ:" -ForegroundColor Cyan
        Write-Host ".\apply-migrations-ready.ps1" -ForegroundColor White
    } else {
        Write-Host "getlifeundo.com недоступен" -ForegroundColor Red
    }
} catch {
    Write-Host "getlifeundo.com недоступен" -ForegroundColor Red
    Write-Host "Требуется Cloudflare + Vercel fix" -ForegroundColor Yellow
}

Write-Host "`nГотово!" -ForegroundColor Green
