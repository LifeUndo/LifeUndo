# Скрипт для проверки исправления middleware на Preview домене

Write-Host "🔍 Проверка исправления middleware на Preview домене..." -ForegroundColor Cyan
Write-Host ""

# Замените на реальный Preview домен из Vercel
$previewDomain = "life-undo-git-fix-middleware-ru-404-lifeundo.vercel.app"  # Замените на ваш реальный домен

Write-Host "📋 Проверка Preview домена ($previewDomain):" -ForegroundColor Yellow
Write-Host ""

$urls = @(
    "/ping",
    "/ru", 
    "/ru/pricing",
    "/api/healthz"
)

foreach ($url in $urls) {
    $fullUrl = "https://$previewDomain" + $url
    Write-Host "==== $url" -ForegroundColor Green
    
    try {
        # Используем curl.exe для Windows
        $result = & curl.exe -I $fullUrl 2>&1
        $statusLine = $result | Where-Object { $_ -match "HTTP/" }
        
        if ($statusLine) {
            if ($statusLine -match "200") {
                Write-Host "  Status: ✅ $statusLine" -ForegroundColor Green
            } elseif ($statusLine -match "30[0-9]") {
                Write-Host "  Status: 🔄 $statusLine" -ForegroundColor Yellow
                $locationLine = $result | Where-Object { $_ -match "Location:" }
                if ($locationLine) {
                    Write-Host "  Redirect: $locationLine" -ForegroundColor Cyan
                }
            } else {
                Write-Host "  Status: ❌ $statusLine" -ForegroundColor Red
            }
        } else {
            Write-Host "  ❌ No HTTP status found" -ForegroundColor Red
        }
        
    } catch {
        Write-Host "  ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

Write-Host "📋 Проверка корня (должен редиректить на /ru):" -ForegroundColor Yellow
try {
    $result = & curl.exe -I "https://$previewDomain/" 2>&1
    $statusLine = $result | Where-Object { $_ -match "HTTP/" }
    $locationLine = $result | Where-Object { $_ -match "Location:" }
    
    if ($statusLine) {
        Write-Host "  Status: $statusLine" -ForegroundColor $(if ($statusLine -match "30[0-9]") { "Green" } else { "Red" })
    }
    if ($locationLine) {
        Write-Host "  Redirect: $locationLine" -ForegroundColor Cyan
    }
} catch {
    Write-Host "  ❌ Error checking root redirect" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ Проверка завершена!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Что проверить дополнительно:" -ForegroundColor Yellow
Write-Host "1. Открыть https://$previewDomain/ru в браузере - должна открыться главная" -ForegroundColor White
Write-Host "2. Открыть https://$previewDomain/ping в браузере - должно показать 'pong'" -ForegroundColor White
Write-Host "3. Открыть https://$previewDomain/api/healthz в браузере - должно показать 'ok'" -ForegroundColor White
Write-Host "4. Проверить https://$previewDomain/ - должен перенаправить на /ru" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Если есть проблемы, проверьте логи:" -ForegroundColor Yellow
Write-Host "vercel logs $previewDomain --since=10m" -ForegroundColor White
