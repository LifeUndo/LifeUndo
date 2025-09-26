# Email Pause Smoke Test
# Проверка полного цикла: SMTP → HOLD → APPROVE → SENT

Write-Host "Email Pause Smoke Test" -ForegroundColor Green
Write-Host "======================" -ForegroundColor Green
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

# 1. Проверка SMTP Listener (порт 2525)
Write-Host "1. Проверка SMTP Listener (порт 2525)..." -ForegroundColor Yellow
try {
    $tcpClient = New-Object System.Net.Sockets.TcpClient
    $tcpClient.Connect("localhost", 2525)
    if ($tcpClient.Connected) {
        Write-Host "   ✅ SMTP Listener работает на порту 2525" -ForegroundColor Green
        $tcpClient.Close()
    } else {
        Write-Host "   ❌ SMTP Listener не отвечает на порту 2525" -ForegroundColor Red
    }
}
catch {
    Write-Host "   ❌ SMTP Listener недоступен: $($_.Exception.Message)" -ForegroundColor Red
}

# 2. Проверка Email Pause API endpoints
Write-Host "`n2. Проверка Email Pause API endpoints..." -ForegroundColor Yellow

# Базовые заголовки
$headers = @{
    "Authorization" = "Basic " + [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("admin:password"))
    "Content-Type" = "application/json"
}

# Проверка списка писем
$listResult = Test-Endpoint -Uri "https://getlifeundo.com/api/admin/email" -Headers $headers
if ($listResult.Success) {
    Write-Host "   ✅ GET /api/admin/email - OK" -ForegroundColor Green
    $emails = $listResult.Data
    Write-Host "   📧 Найдено писем: $($emails.Count)" -ForegroundColor Cyan
} else {
    Write-Host "   ❌ GET /api/admin/email - Error: $($listResult.Error)" -ForegroundColor Red
}

# 3. Проверка Email Rules
Write-Host "`n3. Проверка Email Rules..." -ForegroundColor Yellow
$rulesResult = Test-Endpoint -Uri "https://getlifeundo.com/api/admin/email/rules" -Headers $headers
if ($rulesResult.Success) {
    Write-Host "   ✅ GET /api/admin/email/rules - OK" -ForegroundColor Green
    $rules = $rulesResult.Data
    Write-Host "   📋 Найдено правил: $($rules.Count)" -ForegroundColor Cyan
} else {
    Write-Host "   ❌ GET /api/admin/email/rules - Error: $($rulesResult.Error)" -ForegroundColor Red
}

# 4. Проверка System Health
Write-Host "`n4. Проверка System Health..." -ForegroundColor Yellow
$healthResult = Test-Endpoint -Uri "https://getlifeundo.com/api/_health/smtp" -Headers $headers
if ($healthResult.Success) {
    Write-Host "   ✅ GET /api/_health/smtp - OK" -ForegroundColor Green
    $health = $healthResult.Data
    Write-Host "   🔍 SMTP Health: $($health.status)" -ForegroundColor Cyan
} else {
    Write-Host "   ❌ GET /api/_health/smtp - Error: $($healthResult.Error)" -ForegroundColor Red
}

# 5. Инструкции для ручного тестирования
Write-Host "`n5. Инструкции для ручного тестирования:" -ForegroundColor Yellow
Write-Host "   📧 Отправь тестовое письмо на SMTP :2525:" -ForegroundColor White
Write-Host "      swaks --to test@example.com --from sender@example.com --server localhost:2525" -ForegroundColor Gray
Write-Host "   🔍 Проверь в админке: /admin/email" -ForegroundColor White
Write-Host "   ✅ Одобри письмо: POST /api/admin/email/<id>/approve" -ForegroundColor White
Write-Host "   📊 Проверь relay-log: GET /api/admin/email/<id>/relay-log" -ForegroundColor White

# 6. Проверка Billing API (связанные endpoints)
Write-Host "`n6. Проверка Billing API..." -ForegroundColor Yellow
$billingResult = Test-Endpoint -Uri "https://getlifeundo.com/api/admin/subscription" -Headers $headers
if ($billingResult.Success) {
    Write-Host "   ✅ GET /api/admin/subscription - OK" -ForegroundColor Green
    $subscription = $billingResult.Data
    Write-Host "   💳 План: $($subscription.plan.name)" -ForegroundColor Cyan
} else {
    Write-Host "   ❌ GET /api/admin/subscription - Error: $($billingResult.Error)" -ForegroundColor Red
}

Write-Host "`n🎯 Smoke Test завершён!" -ForegroundColor Green
Write-Host "Если все пункты зелёные - Email Pause готов к работе!" -ForegroundColor Green

