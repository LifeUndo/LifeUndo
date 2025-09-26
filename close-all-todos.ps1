# Close All TODOs - Финальный скрипт для закрытия всех висящих задач
# Выполнить после DNS/SSL фикса и применения миграций

Write-Host "🚀 Close All TODOs - Финальный скрипт" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Функция для проверки URL
function Test-Endpoint {
    param(
        [string]$Uri,
        [string]$Method = "GET",
        [hashtable]$Headers = @{},
        [string]$Body = $null
    )
    
    try {
        $params = @{
            Uri = $Uri
            Method = $Method
            Headers = $Headers
            TimeoutSec = 10
            UseBasicParsing = $true
        }
        
        if ($Body) {
            $params.Body = $Body
        }
        
        $response = Invoke-RestMethod @params -ErrorAction Stop
        return @{
            Success = $true
            Data = $response
        }
    }
    catch {
        return @{
            Success = $false
            Error = $_.Exception.Message
        }
    }
}

# Счётчик выполненных задач
$completedTasks = 0
$totalTasks = 0

# Функция для проверки задачи
function Check-Task {
    param(
        [string]$TaskName,
        [string]$TestUrl,
        [string]$ExpectedStatus = "200"
    )
    
    $script:totalTasks++
    Write-Host "🔍 Проверка: $TaskName" -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri $TestUrl -Method Head -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
        if ($response.StatusCode -eq $ExpectedStatus) {
            Write-Host "   ✅ $TaskName - ВЫПОЛНЕНО" -ForegroundColor Green
            $script:completedTasks++
            return $true
        } else {
            Write-Host "   ❌ $TaskName - ОШИБКА (статус: $($response.StatusCode))" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "   ❌ $TaskName - ОШИБКА: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Функция для проверки API endpoint
function Check-APIEndpoint {
    param(
        [string]$TaskName,
        [string]$TestUrl,
        [hashtable]$Headers = @{}
    )
    
    $script:totalTasks++
    Write-Host "🔍 Проверка: $TaskName" -ForegroundColor Yellow
    
    $result = Test-Endpoint -Uri $TestUrl -Headers $Headers
    if ($result.Success) {
        Write-Host "   ✅ $TaskName - ВЫПОЛНЕНО" -ForegroundColor Green
        $script:completedTasks++
        return $true
    } else {
        Write-Host "   ❌ $TaskName - ОШИБКА: $($result.Error)" -ForegroundColor Red
        return $false
    }
}

Write-Host "📋 Проверка всех TODO задач..." -ForegroundColor Cyan
Write-Host ""

# 1. DNS/SSL Fix (основные домены)
Write-Host "1. 🌐 DNS/SSL Fix:" -ForegroundColor Magenta
$dnsOk = Check-Task "Cloudflare DNS fix" "https://getlifeundo.com/"
$sslOk = Check-Task "Vercel SSL fix" "https://www.getlifeundo.com/"

# 2. Основные страницы
Write-Host "`n2. 📄 Основные страницы:" -ForegroundColor Magenta
Check-Task "Home page" "https://getlifeundo.com/"
Check-Task "Admin panel" "https://getlifeundo.com/admin"
Check-Task "System Health" "https://getlifeundo.com/admin/system-health"

# 3. API Endpoints (с аутентификацией)
$headers = @{
    "Authorization" = "Basic " + [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("admin:password"))
    "Content-Type" = "application/json"
}

Write-Host "`n3. 🔌 API Endpoints:" -ForegroundColor Magenta
Check-APIEndpoint "Billing Plans" "https://getlifeundo.com/api/billing/plans" $headers
Check-APIEndpoint "Subscription" "https://getlifeundo.com/api/admin/subscription" $headers
Check-APIEndpoint "Quotas Usage" "https://getlifeundo.com/api/admin/quotas/usage" $headers
Check-APIEndpoint "Invoices" "https://getlifeundo.com/api/admin/invoices" $headers

# 4. Email Pause API
Write-Host "`n4. 📧 Email Pause API:" -ForegroundColor Magenta
Check-APIEndpoint "Email List" "https://getlifeundo.com/api/admin/email" $headers
Check-APIEndpoint "Email Rules" "https://getlifeundo.com/api/admin/email/rules" $headers

# 5. Health Checks
Write-Host "`n5. 🏥 Health Checks:" -ForegroundColor Magenta
Check-APIEndpoint "DNS/SSL Health" "https://getlifeundo.com/api/_health/dns-ssl" $headers
Check-APIEndpoint "SMTP Health" "https://getlifeundo.com/api/_health/smtp" $headers
Check-APIEndpoint "FreeKassa Health" "https://getlifeundo.com/api/_health/freekassa" $headers

# 6. Проверка SMTP Listener
Write-Host "`n6. 📨 SMTP Listener:" -ForegroundColor Magenta
$script:totalTasks++
Write-Host "🔍 Проверка: SMTP Listener (порт 2525)" -ForegroundColor Yellow
try {
    $tcpClient = New-Object System.Net.Sockets.TcpClient
    $tcpClient.Connect("localhost", 2525)
    if ($tcpClient.Connected) {
        Write-Host "   ✅ SMTP Listener - ВЫПОЛНЕНО" -ForegroundColor Green
        $script:completedTasks++
        $tcpClient.Close()
    } else {
        Write-Host "   ❌ SMTP Listener - ОШИБКА (не подключился)" -ForegroundColor Red
    }
}
catch {
    Write-Host "   ❌ SMTP Listener - ОШИБКА: $($_.Exception.Message)" -ForegroundColor Red
}

# Итоговый отчёт
Write-Host "`n📊 ИТОГОВЫЙ ОТЧЁТ:" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan
Write-Host "✅ Выполнено задач: $completedTasks из $totalTasks" -ForegroundColor Green

$percentage = [math]::Round(($completedTasks / $totalTasks) * 100, 1)
Write-Host "📈 Процент выполнения: $percentage%" -ForegroundColor Cyan

if ($percentage -ge 90) {
    Write-Host "🎉 ОТЛИЧНО! Все основные TODO закрыты!" -ForegroundColor Green
    Write-Host "🚀 Можно переходить к PATCH 0.4.9-FUND!" -ForegroundColor Green
} elseif ($percentage -ge 70) {
    Write-Host "⚠️ ХОРОШО! Большинство TODO закрыто, остались минорные задачи." -ForegroundColor Yellow
} else {
    Write-Host "❌ ТРЕБУЕТСЯ ДОРАБОТКА! Много задач не выполнено." -ForegroundColor Red
}

# Рекомендации
Write-Host "`n💡 РЕКОМЕНДАЦИИ:" -ForegroundColor Cyan
if (-not $dnsOk -or -not $sslOk) {
    Write-Host "🔧 Сначала исправь DNS/SSL в Cloudflare + Vercel" -ForegroundColor Yellow
}
Write-Host "📋 Проверь миграции: .\migration-verification.sql" -ForegroundColor Yellow
Write-Host "📧 Запусти SMTP сервисы: npm run smtp:start && npm run relay:start" -ForegroundColor Yellow
Write-Host "🧪 Выполни smoke-тесты: .\email-pause-smoke-test.ps1 && .\billing-smoke-test.ps1" -ForegroundColor Yellow

Write-Host "`n🎯 Скрипт завершён!" -ForegroundColor Green

