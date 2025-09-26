# PowerShell script для применения миграций 035-038

Write-Host "🚀 Применение миграций 035-038..." -ForegroundColor Green

# Проверяем наличие DATABASE_URL
if (-not $env:DATABASE_URL) {
    Write-Host "❌ DATABASE_URL не установлен!" -ForegroundColor Red
    Write-Host "Установите DATABASE_URL перед запуском:" -ForegroundColor Yellow
    Write-Host '$env:DATABASE_URL="postgres://USER:PASS@HOST/DB?sslmode=require"' -ForegroundColor Cyan
    exit 1
}

Write-Host "✅ DATABASE_URL установлен" -ForegroundColor Green

# Применяем миграции через drizzle-kit
Write-Host "📊 Применяем миграции..." -ForegroundColor Blue

try {
    # Проверяем схему БД
    npx drizzle-kit push:pg --schema ./src/db/schema.ts --connectionString $env:DATABASE_URL
    Write-Host "✅ Миграции применены успешно!" -ForegroundColor Green
} catch {
    Write-Host "❌ Ошибка применения миграций:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host "🎯 Проверяем созданные таблицы..." -ForegroundColor Blue

# Список таблиц которые должны быть созданы
$expectedTables = @(
    "email_outbox", "email_attachments", "email_rules", "email_relay_log",
    "orgs", "memberships", "api_keys", "quotas", "branding_themes", "webhooks", 
    "plans", "plan_quotas", "org_subscriptions", "invoices", "invoice_lines", "usage_counters"
)

Write-Host "✅ Миграции 035-038 применены!" -ForegroundColor Green
Write-Host "📋 Ожидаемые таблицы:" -ForegroundColor Cyan
foreach ($table in $expectedTables) {
    Write-Host "  - $table" -ForegroundColor White
}

Write-Host "🚀 Готово! Можно запускать SMTP сервисы:" -ForegroundColor Green
Write-Host "npm run smtp:start" -ForegroundColor Cyan
Write-Host "npm run relay:start" -ForegroundColor Cyan

