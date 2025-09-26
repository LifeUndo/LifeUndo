# Billing API Smoke Test
# Проверка всех billing endpoints после миграций

Write-Host "Billing API Smoke Test" -ForegroundColor Green
Write-Host "=====================" -ForegroundColor Green
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

# Базовые заголовки
$headers = @{
    "Authorization" = "Basic " + [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("admin:password"))
    "Content-Type" = "application/json"
}

# 1. Проверка планов
Write-Host "1. Проверка планов..." -ForegroundColor Yellow
$plansResult = Test-Endpoint -Uri "https://getlifeundo.com/api/billing/plans" -Headers $headers
if ($plansResult.Success) {
    Write-Host "   ✅ GET /api/billing/plans - OK" -ForegroundColor Green
    $plans = $plansResult.Data
    Write-Host "   📋 Найдено планов: $($plans.Count)" -ForegroundColor Cyan
    foreach ($plan in $plans) {
        Write-Host "      - $($plan.name): $($plan.price_cents)¢/$($plan.billing_cycle)" -ForegroundColor Gray
    }
} else {
    Write-Host "   ❌ GET /api/billing/plans - Error: $($plansResult.Error)" -ForegroundColor Red
}

# 2. Проверка подписки
Write-Host "`n2. Проверка подписки..." -ForegroundColor Yellow
$subscriptionResult = Test-Endpoint -Uri "https://getlifeundo.com/api/admin/subscription" -Headers $headers
if ($subscriptionResult.Success) {
    Write-Host "   ✅ GET /api/admin/subscription - OK" -ForegroundColor Green
    $subscription = $subscriptionResult.Data
    Write-Host "   💳 План: $($subscription.plan.name)" -ForegroundColor Cyan
    Write-Host "   📅 Период: $($subscription.current_period_start) - $($subscription.current_period_end)" -ForegroundColor Cyan
    Write-Host "   📊 Статус: $($subscription.status)" -ForegroundColor Cyan
} else {
    Write-Host "   ❌ GET /api/admin/subscription - Error: $($subscriptionResult.Error)" -ForegroundColor Red
}

# 3. Проверка квот и использования
Write-Host "`n3. Проверка квот и использования..." -ForegroundColor Yellow
$quotasResult = Test-Endpoint -Uri "https://getlifeundo.com/api/admin/quotas/usage" -Headers $headers
if ($quotasResult.Success) {
    Write-Host "   ✅ GET /api/admin/quotas/usage - OK" -ForegroundColor Green
    $quotas = $quotasResult.Data
    Write-Host "   📊 Квоты:" -ForegroundColor Cyan
    foreach ($quota in $quotas) {
        $usage = $quota.usage
        $limit = $quota.limit
        $percent = if ($limit -gt 0) { [math]::Round(($usage / $limit) * 100, 1) } else { 0 }
        Write-Host "      - $($quota.name): $usage/$limit ($percent%)" -ForegroundColor Gray
    }
} else {
    Write-Host "   ❌ GET /api/admin/quotas/usage - Error: $($quotasResult.Error)" -ForegroundColor Red
}

# 4. Проверка лимитов
Write-Host "`n4. Проверка лимитов..." -ForegroundColor Yellow
$limitsResult = Test-Endpoint -Uri "https://getlifeundo.com/api/admin/limits" -Headers $headers
if ($limitsResult.Success) {
    Write-Host "   ✅ GET /api/admin/limits - OK" -ForegroundColor Green
    $limits = $limitsResult.Data
    Write-Host "   🚨 Лимиты:" -ForegroundColor Cyan
    foreach ($limit in $limits) {
        $status = if ($limit.is_over_limit) { "🔴 OVER" } else { "🟢 OK" }
        Write-Host "      - $($limit.name): $status" -ForegroundColor Gray
    }
} else {
    Write-Host "   ❌ GET /api/admin/limits - Error: $($limitsResult.Error)" -ForegroundColor Red
}

# 5. Проверка инвойсов
Write-Host "`n5. Проверка инвойсов..." -ForegroundColor Yellow
$invoicesResult = Test-Endpoint -Uri "https://getlifeundo.com/api/admin/invoices" -Headers $headers
if ($invoicesResult.Success) {
    Write-Host "   ✅ GET /api/admin/invoices - OK" -ForegroundColor Green
    $invoices = $invoicesResult.Data
    Write-Host "   📄 Найдено инвойсов: $($invoices.Count)" -ForegroundColor Cyan
    foreach ($invoice in $invoices) {
        Write-Host "      - #$($invoice.number): $($invoice.total_cents)¢ ($($invoice.status))" -ForegroundColor Gray
    }
} else {
    Write-Host "   ❌ GET /api/admin/invoices - Error: $($invoicesResult.Error)" -ForegroundColor Red
}

# 6. Проверка смены плана (тест)
Write-Host "`n6. Проверка смены плана..." -ForegroundColor Yellow
$changePlanBody = @{
    plan_code = "PRO"
} | ConvertTo-Json

$changeResult = Test-Endpoint -Uri "https://getlifeundo.com/api/admin/subscription/change" -Method "POST" -Headers $headers -Body $changePlanBody
if ($changeResult.Success) {
    Write-Host "   ✅ POST /api/admin/subscription/change - OK" -ForegroundColor Green
    $result = $changeResult.Data
    Write-Host "   🔄 План изменён на: $($result.plan.name)" -ForegroundColor Cyan
} else {
    Write-Host "   ❌ POST /api/admin/subscription/change - Error: $($changeResult.Error)" -ForegroundColor Red
}

# 7. Проверка System Health
Write-Host "`n7. Проверка System Health..." -ForegroundColor Yellow
$healthResult = Test-Endpoint -Uri "https://getlifeundo.com/api/_health/dns-ssl" -Headers $headers
if ($healthResult.Success) {
    Write-Host "   ✅ GET /api/_health/dns-ssl - OK" -ForegroundColor Green
    $health = $healthResult.Data
    Write-Host "   🌐 DNS/SSL Health: $($health.status)" -ForegroundColor Cyan
} else {
    Write-Host "   ❌ GET /api/_health/dns-ssl - Error: $($healthResult.Error)" -ForegroundColor Red
}

# 8. Проверка FreeKassa
Write-Host "`n8. Проверка FreeKassa..." -ForegroundColor Yellow
$fkResult = Test-Endpoint -Uri "https://getlifeundo.com/api/_health/freekassa" -Headers $headers
if ($fkResult.Success) {
    Write-Host "   ✅ GET /api/_health/freekassa - OK" -ForegroundColor Green
    $fk = $fkResult.Data
    Write-Host "   💳 FreeKassa Health: $($fk.status)" -ForegroundColor Cyan
} else {
    Write-Host "   ❌ GET /api/_health/freekassa - Error: $($fkResult.Error)" -ForegroundColor Red
}

Write-Host "`n🎯 Billing Smoke Test завершён!" -ForegroundColor Green
Write-Host "Если все пункты зелёные - Billing система готова к работе!" -ForegroundColor Green

