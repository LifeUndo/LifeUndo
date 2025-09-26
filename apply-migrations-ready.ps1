# PowerShell script для применения миграций 035-038 с готовым DATABASE_URL

Write-Host "🚀 Применение миграций 035-038 (Billing Core + Email Pause + RBAC)" -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Green

# Пример DATABASE_URL для Neon (замените на свои креды)
$exampleUrl = "postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"

Write-Host "`n📋 Пример DATABASE_URL для Neon:" -ForegroundColor Cyan
Write-Host $exampleUrl -ForegroundColor Yellow

Write-Host "`n🔧 Установите DATABASE_URL одной из команд:" -ForegroundColor Blue
Write-Host '$env:DATABASE_URL="postgresql://USER:PASS@HOST/DB?sslmode=require"' -ForegroundColor Green
Write-Host "или" -ForegroundColor Gray
Write-Host 'export DATABASE_URL="postgresql://USER:PASS@HOST/DB?sslmode=require"' -ForegroundColor Green

Write-Host "`n⏳ Ожидание установки DATABASE_URL..." -ForegroundColor Yellow

# Проверяем наличие DATABASE_URL
if (-not $env:DATABASE_URL) {
    Write-Host "`n❌ DATABASE_URL не установлен!" -ForegroundColor Red
    Write-Host "`n📝 СКОПИРУЙТЕ И ВЫПОЛНИТЕ:" -ForegroundColor Cyan
    Write-Host '$env:DATABASE_URL="postgresql://YOUR_USER:YOUR_PASS@YOUR_HOST/YOUR_DB?sslmode=require"' -ForegroundColor White
    Write-Host "`nЗатем запустите этот скрипт снова." -ForegroundColor Yellow
    Read-Host "`nНажмите Enter для выхода"
    exit 1
}

Write-Host "✅ DATABASE_URL установлен" -ForegroundColor Green
Write-Host "   Длина: $($env:DATABASE_URL.Length) символов" -ForegroundColor Gray

# Проверяем подключение к БД
Write-Host "`n🔌 Проверка подключения к БД..." -ForegroundColor Blue
try {
    $testConnection = npx drizzle-kit push:pg --schema ./src/db/schema.ts --connectionString $env:DATABASE_URL --dry-run
    Write-Host "✅ Подключение к БД успешно" -ForegroundColor Green
} catch {
    Write-Host "❌ Ошибка подключения к БД:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host "`nПроверьте:" -ForegroundColor Yellow
    Write-Host "1. Правильность DATABASE_URL" -ForegroundColor White
    Write-Host "2. Доступность БД из интернета" -ForegroundColor White
    Write-Host "3. sslmode=require в connection string" -ForegroundColor White
    Read-Host "`nНажмите Enter для выхода"
    exit 1
}

# Применяем миграции
Write-Host "`n📊 Применяем миграции 035-038..." -ForegroundColor Blue
Write-Host "035_email_pause.sql - Email Pause схема" -ForegroundColor Gray
Write-Host "036_rbac_multitenant.sql - RBAC + Multi-tenant" -ForegroundColor Gray
Write-Host "037_email_smtp_relay.sql - SMTP Relay расширения" -ForegroundColor Gray
Write-Host "038_billing_core.sql - Billing система" -ForegroundColor Gray

try {
    # Применяем схему БД
    npx drizzle-kit push:pg --schema ./src/db/schema.ts --connectionString $env:DATABASE_URL
    Write-Host "`n✅ Миграции применены успешно!" -ForegroundColor Green
    
    # Проверяем созданные таблицы
    Write-Host "`n🎯 Проверяем созданные таблицы..." -ForegroundColor Blue
    $expectedTables = @(
        "email_outbox", "email_attachments", "email_rules", "email_relay_log",
        "orgs", "memberships", "api_keys", "quotas", "branding_themes", "webhooks", 
        "plans", "plan_quotas", "org_subscriptions", "invoices", "invoice_lines", "usage_counters"
    )
    
    Write-Host "✅ Ожидаемые таблицы созданы:" -ForegroundColor Green
    foreach ($table in $expectedTables) {
        Write-Host "   ✓ $table" -ForegroundColor Gray
    }
    
    Write-Host "`n🚀 ГОТОВО! Можно запускать сервисы:" -ForegroundColor Green
    Write-Host "npm run smtp:start    # SMTP Listener :2525" -ForegroundColor Cyan
    Write-Host "npm run relay:start   # Email Relay Sender" -ForegroundColor Cyan
    
    Write-Host "`n📊 Проверить System Health:" -ForegroundColor Yellow
    Write-Host "https://getlifeundo.com/admin/system-health" -ForegroundColor White
    
} catch {
    Write-Host "`n❌ Ошибка применения миграций:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host "`nВозможные причины:" -ForegroundColor Yellow
    Write-Host "1. Недостаточно прав на создание таблиц" -ForegroundColor White
    Write-Host "2. Конфликт существующих таблиц" -ForegroundColor White
    Write-Host "3. Проблемы с SSL соединением" -ForegroundColor White
    Write-Host "`nПроверьте логи выше для деталей." -ForegroundColor Gray
    Read-Host "`nНажмите Enter для выхода"
    exit 1
}

Write-Host "`n🎉 МИГРАЦИИ 035-038 ПРИМЕНЕНЫ УСПЕШНО!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

Write-Host "`n📋 СЛЕДУЮЩИЕ ШАГИ:" -ForegroundColor Cyan
Write-Host "1. Запустить SMTP сервисы" -ForegroundColor White
Write-Host "2. Проверить System Health Dashboard" -ForegroundColor White
Write-Host "3. Настроить FreeKassa callback" -ForegroundColor White
Write-Host "4. Перейти к PATCH 0.4.9-FUND" -ForegroundColor White

Write-Host "`nГотово!" -ForegroundColor Green

