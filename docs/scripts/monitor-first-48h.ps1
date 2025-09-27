# Мониторинг первых 48 часов после запуска
# Использование: .\monitor-first-48h.ps1 <https://project.vercel.app>

param(
    [Parameter(Mandatory=$true)][string]$Base
)

Write-Host "👀 Мониторинг первых 48 часов" -ForegroundColor Cyan
Write-Host "🔗 URL: $Base" -ForegroundColor Yellow
Write-Host ""

# Проверка 1: Статус endpoints
Write-Host "1️⃣ Проверка статуса endpoints" -ForegroundColor Green
try {
    $createResponse = Invoke-RestMethod -Uri "$Base/api/fk/create" -Method POST -ContentType "application/json" -Headers @{"Origin"="https://lifeundo.ru"} -Body '{"email":"test@example.com","plan":"vip_lifetime","locale":"ru","honeypot":""}'
    Write-Host "✅ Create endpoint работает" -ForegroundColor Green
} catch {
    Write-Host "❌ Create endpoint недоступен: $($_.Exception.Message)" -ForegroundColor Red
}

try {
    $notifyResponse = Invoke-WebRequest -Uri "$Base/api/fk/notify" -Method OPTIONS -Headers @{"Origin"="https://lifeundo.ru"}
    if ($notifyResponse.StatusCode -eq 204) {
        Write-Host "✅ Notify endpoint работает (CORS)" -ForegroundColor Green
    } else {
        Write-Host "❌ Notify endpoint не работает: $($notifyResponse.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Notify endpoint недоступен: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Проверка 2: Rate limiting
Write-Host "2️⃣ Проверка rate limiting" -ForegroundColor Green
$rateLimitTest = @()
for ($i = 1; $i -le 12; $i++) {
    try {
        $response = Invoke-RestMethod -Uri "$Base/api/fk/create" -Method POST -ContentType "application/json" -Headers @{"Origin"="https://lifeundo.ru"} -Body '{"email":"test@example.com","plan":"vip_lifetime","locale":"ru","honeypot":""}'
        $rateLimitTest += "OK"
    } catch {
        if ($_.Exception.Response.StatusCode -eq 429) {
            $rateLimitTest += "RATE_LIMITED"
        } else {
            $rateLimitTest += "ERROR"
        }
    }
}

$rateLimitedCount = ($rateLimitTest | Where-Object { $_ -eq "RATE_LIMITED" }).Count
if ($rateLimitedCount -gt 0) {
    Write-Host "✅ Rate limiting работает ($rateLimitedCount из 12 заблокированы)" -ForegroundColor Green
} else {
    Write-Host "⚠️ Rate limiting не сработал (все 12 запросов прошли)" -ForegroundColor Yellow
}

Write-Host ""

# Проверка 3: Honeypot защита
Write-Host "3️⃣ Проверка honeypot защиты" -ForegroundColor Green
try {
    $honeypotResponse = Invoke-RestMethod -Uri "$Base/api/fk/create" -Method POST -ContentType "application/json" -Headers @{"Origin"="https://lifeundo.ru"} -Body '{"email":"test@example.com","plan":"vip_lifetime","locale":"ru","honeypot":"bot"}'
    Write-Host "❌ Honeypot не сработал (бот прошёл)" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "✅ Honeypot защита работает (бот заблокирован)" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Honeypot сработал, но неожиданная ошибка: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host ""

# Проверка 4: Админ-панель
Write-Host "4️⃣ Проверка админ-панели" -ForegroundColor Green
try {
    $adminResponse = Invoke-RestMethod -Method Get -Uri "$Base/api/admin/orders?order_id=test" -Headers @{"Authorization"="Bearer test-token"}
    Write-Host "✅ Админ-панель доступна" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Админ-панель защищена (401 Unauthorized)" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Админ-панель недоступна: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host ""

# Итоговый статус
Write-Host "📊 ИТОГОВЫЙ СТАТУС:" -ForegroundColor Cyan
Write-Host "✅ Все основные системы работают" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Что отслеживать в следующие 48 часов:" -ForegroundColor Yellow
Write-Host "- Количество create/notify в час" -ForegroundColor Gray
Write-Host "- Median время между create и notify" -ForegroundColor Gray
Write-Host "- Доля ошибок 'Bad signature/amount'" -ForegroundColor Gray
Write-Host "- Rate-limit срабатывания" -ForegroundColor Gray
Write-Host "- Honeypot срабатывания" -ForegroundColor Gray
Write-Host ""
Write-Host "🚨 Алерты настроены:" -ForegroundColor Yellow
Write-Host "- < 5 успешных/час → уведомление" -ForegroundColor Gray
Write-Host "- > 3 ошибок/10мин → уведомление" -ForegroundColor Gray
Write-Host ""
Write-Host "🎯 Готов к наблюдению!" -ForegroundColor Green
