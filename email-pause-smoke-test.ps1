# email-pause-smoke-test.ps1
# Smoke-тест для Email Pause pipeline

param(
    [Parameter(Mandatory=$true)]
    [string]$BaseUrl
)

Write-Host "📧 Запуск Email Pause smoke-теста..." -ForegroundColor Cyan

# 1. Отправка email (должен попасть в HOLD)
Write-Host "1. Отправка тестового email..." -ForegroundColor Green
$emailData = @{
    to = "test@example.com"
    subject = "Smoke Test Email"
    body = "This is a smoke test email"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/api/email/submit" -Method POST -Body $emailData -ContentType "application/json"
    Write-Host "✅ Email отправлен, ID: $($response.id)" -ForegroundColor Green
    $emailId = $response.id
} catch {
    Write-Host "❌ Ошибка отправки email: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 2. Проверка статуса HOLD
Write-Host "2. Проверка статуса HOLD..." -ForegroundColor Green
try {
    $emailStatus = Invoke-RestMethod -Uri "$BaseUrl/api/admin/email/$emailId" -Method GET
    if ($emailStatus.status -eq "hold") {
        Write-Host "✅ Email в статусе HOLD" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Неожиданный статус: $($emailStatus.status)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Ошибка проверки статуса: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Одобрение email (должен перейти в APPROVED)
Write-Host "3. Одобрение email..." -ForegroundColor Green
try {
    Invoke-RestMethod -Uri "$BaseUrl/api/admin/email/$emailId/approve" -Method POST
    Write-Host "✅ Email одобрен" -ForegroundColor Green
} catch {
    Write-Host "❌ Ошибка одобрения: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "✅ Email Pause smoke-тест завершен." -ForegroundColor Green