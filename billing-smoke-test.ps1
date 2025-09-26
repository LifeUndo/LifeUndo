# billing-smoke-test.ps1
# Smoke-тест для billing API

param(
    [Parameter(Mandatory=$true)]
    [string]$BaseUrl
)

Write-Host "💳 Запуск Billing smoke-теста..." -ForegroundColor Cyan

# 1. Проверка планов
Write-Host "1. Проверка планов..." -ForegroundColor Green
try {
    $plans = Invoke-RestMethod -Uri "$BaseUrl/api/billing/plans" -Method GET
    Write-Host "✅ Планов найдено: $($plans.Count)" -ForegroundColor Green
} catch {
    Write-Host "❌ Ошибка получения планов: $($_.Exception.Message)" -ForegroundColor Red
}

# 2. Проверка админки billing
Write-Host "2. Проверка админки billing..." -ForegroundColor Green
try {
    $billingData = Invoke-RestMethod -Uri "$BaseUrl/admin/billing" -Method GET
    Write-Host "✅ Админка billing доступна" -ForegroundColor Green
} catch {
    Write-Host "❌ Ошибка админки billing: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "✅ Billing smoke-тест завершен." -ForegroundColor Green