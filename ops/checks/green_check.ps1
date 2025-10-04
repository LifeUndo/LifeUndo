# LifeUndo T+1 Smoke Tests
# Проверка работоспособности платежной системы FreeKassa

param(
    [string]$PreviewUrl = "https://lifeundo-git-feature-app-0-4-0-lifeundo.vercel.app"
)

Write-Host "LifeUndo T+1 Smoke Tests" -ForegroundColor Cyan
Write-Host "Preview URL: $PreviewUrl" -ForegroundColor Yellow
Write-Host ""

# Функция для проверки HTTP статуса
function Test-Endpoint {
    param([string]$Url, [int]$ExpectedStatus, [string]$Description)
    
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -MaximumRedirection 0 -ErrorAction SilentlyContinue
        $status = $response.StatusCode
        
        if ($status -eq $ExpectedStatus) {
            Write-Host "PASS: $Description" -ForegroundColor Green
            Write-Host "   Status: $status (expected: $ExpectedStatus)" -ForegroundColor Gray
        } else {
            Write-Host "FAIL: $Description" -ForegroundColor Red
            Write-Host "   Status: $status (expected: $ExpectedStatus)" -ForegroundColor Red
        }
        return $status -eq $ExpectedStatus
    } catch {
        Write-Host "FAIL: $Description" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Функция для проверки JSON ответа
function Test-JsonEndpoint {
    param([string]$Url, [string]$Description)
    
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing
        $json = $response.Content | ConvertFrom-Json
        
        if ($json.ok -eq $true) {
            Write-Host "PASS: $Description" -ForegroundColor Green
            Write-Host "   Response: $($json | ConvertTo-Json -Compress)" -ForegroundColor Gray
            return $true
        } else {
            Write-Host "FAIL: $Description" -ForegroundColor Red
            Write-Host "   Response: $($json | ConvertTo-Json -Compress)" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "FAIL: $Description" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Результаты тестов
$testResults = @()

Write-Host "Basic Health Checks" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan

$testResults += Test-Endpoint "$PreviewUrl/api/healthz" 200 "Health check endpoint"
$testResults += Test-Endpoint "$PreviewUrl/" 307 "Root redirect"
$testResults += Test-Endpoint "$PreviewUrl/ru" 200 "Russian homepage"
$testResults += Test-Endpoint "$PreviewUrl/ru/downloads" 200 "Downloads page"
$testResults += Test-Endpoint "$PreviewUrl/ru/pricing" 200 "Pricing page"

Write-Host ""
Write-Host "FreeKassa Configuration" -ForegroundColor Cyan
Write-Host "=======================" -ForegroundColor Cyan

$testResults += Test-JsonEndpoint "$PreviewUrl/api/debug/fk" "FreeKassa debug endpoint"

Write-Host ""
Write-Host "Payment System Tests" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan

# Тест создания платежа Pro
try {
    $body = @{ productId = "pro_month" } | ConvertTo-Json
    $response = Invoke-WebRequest -Method POST -Uri "$PreviewUrl/api/payments/freekassa/create" -ContentType "application/json" -Body $body -UseBasicParsing
    $json = $response.Content | ConvertFrom-Json
    
    if ($json.ok -eq $true -and $json.pay_url) {
        Write-Host "PASS: Payment creation (Pro)" -ForegroundColor Green
        Write-Host "   Order ID: $($json.orderId)" -ForegroundColor Gray
        Write-Host "   Pay URL: $($json.pay_url.Substring(0, 50))..." -ForegroundColor Gray
        $testResults += $true
    } else {
        Write-Host "FAIL: Payment creation (Pro)" -ForegroundColor Red
        Write-Host "   Response: $($json | ConvertTo-Json -Compress)" -ForegroundColor Red
        $testResults += $false
    }
} catch {
    Write-Host "FAIL: Payment creation (Pro)" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += $false
}

# Тест неверного плана
try {
    $body = @{ productId = "invalid_plan" } | ConvertTo-Json
    $response = Invoke-WebRequest -Method POST -Uri "$PreviewUrl/api/payments/freekassa/create" -ContentType "application/json" -Body $body -UseBasicParsing
    $json = $response.Content | ConvertFrom-Json
    
    if ($json.ok -eq $false -and $json.error -eq "unknown_plan") {
        Write-Host "PASS: Invalid plan rejection" -ForegroundColor Green
        Write-Host "   Error: $($json.error)" -ForegroundColor Gray
        $testResults += $true
    } else {
        Write-Host "FAIL: Invalid plan rejection" -ForegroundColor Red
        Write-Host "   Response: $($json | ConvertTo-Json -Compress)" -ForegroundColor Red
        $testResults += $false
    }
} catch {
    Write-Host "FAIL: Invalid plan rejection" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += $false
}

Write-Host ""
Write-Host "Test Results Summary" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan

$passed = ($testResults | Where-Object { $_ -eq $true }).Count
$total = $testResults.Count
$failed = $total - $passed

Write-Host "Total tests: $total" -ForegroundColor White
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor Red

if ($failed -eq 0) {
    Write-Host ""
    Write-Host "All tests passed! Ready for production deployment." -ForegroundColor Green
    exit 0
} else {
    Write-Host ""
    Write-Host "Some tests failed. Review issues before production deployment." -ForegroundColor Yellow
    exit 1
}