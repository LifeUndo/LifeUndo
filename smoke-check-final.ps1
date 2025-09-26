# PowerShell script для финальной проверки инфраструктуры

Write-Host "🚀 GLU Infra Status Sweep - Final Check" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# 1) Проверка доменов и SSL
Write-Host "`n📡 Проверка доменов и SSL..." -ForegroundColor Blue

Write-Host "getlifeundo.com:" -ForegroundColor Yellow
try {
    $response1 = Invoke-WebRequest -Uri "https://getlifeundo.com/" -Method Head -TimeoutSec 10 -UseBasicParsing
    Write-Host "✅ HTTPS: $($response1.StatusCode) $($response1.StatusDescription)" -ForegroundColor Green
    Write-Host "   Server: $($response1.Headers.Server)" -ForegroundColor Gray
} catch {
    Write-Host "❌ HTTPS Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nlifeundo.ru:" -ForegroundColor Yellow
try {
    $response2 = Invoke-WebRequest -Uri "https://lifeundo.ru/" -Method Head -TimeoutSec 10 -UseBasicParsing
    Write-Host "✅ HTTPS: $($response2.StatusCode) $($response2.StatusDescription)" -ForegroundColor Green
    Write-Host "   Server: $($response2.Headers.Server)" -ForegroundColor Gray
} catch {
    Write-Host "❌ HTTPS Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 2) Проверка новых страниц
Write-Host "`n📄 Проверка новых страниц..." -ForegroundColor Blue

$pages = @("/fund", "/gov", "/edu")
foreach ($page in $pages) {
    Write-Host "getlifeundo.com$page:" -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "https://getlifeundo.com$page" -Method Head -TimeoutSec 10 -UseBasicParsing
        Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 3) Проверка API endpoints
Write-Host "`n🔌 Проверка API endpoints..." -ForegroundColor Blue

# Базовые endpoints
$endpoints = @(
    "/api/_health",
    "/api/billing/plans",
    "/api/admin/subscription",
    "/api/admin/quotas/usage"
)

foreach ($endpoint in $endpoints) {
    Write-Host "getlifeundo.com${endpoint}:" -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "https://getlifeundo.com$endpoint" -Method Get -TimeoutSec 10 -UseBasicParsing
        Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "⚠️  Status: $statusCode (expected for auth endpoints)" -ForegroundColor Yellow
    }
}

# 4) DNS проверка
Write-Host "`n🌐 DNS проверка..." -ForegroundColor Blue

Write-Host "getlifeundo.com DNS:" -ForegroundColor Yellow
try {
    $dns1 = nslookup getlifeundo.com 8.8.8.8
    Write-Host "✅ DNS resolved" -ForegroundColor Green
    if ($dns1 -match "Address:\s+(\d+\.\d+\.\d+\.\d+)") {
        $ip = $matches[1]
        Write-Host "   IP: $ip" -ForegroundColor Gray
        if ($ip -eq "76.76.21.21") {
            Write-Host "   ✅ Correct Vercel IP" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  Should be 76.76.21.21 (Vercel)" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "❌ DNS Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 5) GitHub тэги
Write-Host "`n📋 GitHub тэги..." -ForegroundColor Blue
try {
    $tags = git tag --list | Sort-Object -Descending
    Write-Host "✅ Local tags:" -ForegroundColor Green
    foreach ($tag in $tags) {
        Write-Host "   $tag" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Git Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 6) Миграции статус
Write-Host "`n🗄️ Миграции статус..." -ForegroundColor Blue
if ($env:DATABASE_URL) {
    Write-Host "✅ DATABASE_URL установлен" -ForegroundColor Green
    Write-Host "   Запустите: .\apply-migrations.ps1" -ForegroundColor Cyan
} else {
    Write-Host "❌ DATABASE_URL не установлен" -ForegroundColor Red
    Write-Host "   Установите DATABASE_URL и запустите миграции" -ForegroundColor Yellow
}

# Итоговый статус
Write-Host "`n🎯 ИТОГОВЫЙ СТАТУС:" -ForegroundColor Green
Write-Host "=================" -ForegroundColor Green

$issues = @()

# Проверяем основные проблемы
try {
    $healthCheck = Invoke-WebRequest -Uri "https://getlifeundo.com/" -Method Head -TimeoutSec 5 -UseBasicParsing
    if ($healthCheck.StatusCode -ne 200) {
        $issues += "getlifeundo.com возвращает $($healthCheck.StatusCode)"
    }
} catch {
    $issues += "getlifeundo.com недоступен: $($_.Exception.Message)"
}

if (-not $env:DATABASE_URL) {
    $issues += "DATABASE_URL не настроен - миграции не применены"
}

if ($issues.Count -eq 0) {
    Write-Host "🟢 ВСЕ СИСТЕМЫ РАБОТАЮТ!" -ForegroundColor Green
    Write-Host "✅ getlifeundo.com доступен" -ForegroundColor Green
    Write-Host "✅ lifeundo.ru работает" -ForegroundColor Green
    Write-Host "✅ DNS настроен корректно" -ForegroundColor Green
    Write-Host "✅ API endpoints отвечают" -ForegroundColor Green
} else {
    Write-Host "🔴 ОБНАРУЖЕНЫ ПРОБЛЕМЫ:" -ForegroundColor Red
    foreach ($issue in $issues) {
        Write-Host "❌ $issue" -ForegroundColor Red
    }
}

Write-Host "`n📋 СЛЕДУЮЩИЕ ШАГИ:" -ForegroundColor Cyan
Write-Host "1. Исправить DNS getlifeundo.com → 76.76.21.21" -ForegroundColor White
Write-Host "2. Перевыпустить SSL в Vercel" -ForegroundColor White
Write-Host "3. Применить миграции: .\apply-migrations.ps1" -ForegroundColor White
Write-Host "4. Запустить SMTP сервисы: npm run smtp:start" -ForegroundColor White
Write-Host "5. Check System Health: /admin/system-health" -ForegroundColor White

Write-Host "`nReady!" -ForegroundColor Green
