# Скрипт для финальных проверок продакшена после исправления middleware

Write-Host "🚀 Финальные проверки продакшена lifeundo.ru..." -ForegroundColor Cyan
Write-Host ""

$prodDomain = "lifeundo.ru"

Write-Host "📋 Проверка продакшн домена ($prodDomain):" -ForegroundColor Yellow
Write-Host ""

$urls = @(
    "/ru",
    "/ru/pricing", 
    "/ru/support",
    "/ru/use-cases",
    "/ru/fund/apply",
    "/ru/privacy",
    "/ok"
)

foreach ($url in $urls) {
    $fullUrl = "https://$prodDomain" + $url
    Write-Host "==== $url" -ForegroundColor Green
    
    try {
        # Используем curl.exe для Windows
        $result = & curl.exe -I $fullUrl 2>&1
        $statusLine = $result | Where-Object { $_ -match "HTTP/" }
        
        if ($statusLine) {
            if ($statusLine -match "200") {
                Write-Host "  Status: ✅ $statusLine" -ForegroundColor Green
                
                # Проверка кэширования для /ok
                if ($url -eq "/ok") {
                    $cacheLine = $result | Where-Object { $_ -match "Cache-Control:" }
                    if ($cacheLine -and $cacheLine -match "no-store") {
                        Write-Host "  Cache-Control: ✅ $cacheLine" -ForegroundColor Green
                    } else {
                        Write-Host "  Cache-Control: ❌ $cacheLine" -ForegroundColor Red
                    }
                }
                
                # Проверка security headers для /ru
                if ($url -eq "/ru") {
                    $securityHeaders = @("X-Frame-Options", "X-Content-Type-Options", "Referrer-Policy", "Strict-Transport-Security")
                    foreach ($header in $securityHeaders) {
                        $headerLine = $result | Where-Object { $_ -match "$header:" }
                        if ($headerLine) {
                            Write-Host "  $header: ✅ $headerLine" -ForegroundColor Green
                        } else {
                            Write-Host "  $header: ❌ Missing" -ForegroundColor Red
                        }
                    }
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
    $result = & curl.exe -I "https://$prodDomain/" 2>&1
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
Write-Host "✅ Финальная проверка завершена!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Что проверить дополнительно:" -ForegroundColor Yellow
Write-Host "1. Открыть https://$prodDomain/ в браузере - должен перенаправить на /ru" -ForegroundColor White
Write-Host "2. Открыть https://$prodDomain/ru в браузере - должна открыться главная" -ForegroundColor White
Write-Host "3. Проверить все страницы навигации" -ForegroundColor White
Write-Host "4. Убедиться, что нет ошибок в консоли браузера" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Ожидаемые результаты:" -ForegroundColor Yellow
Write-Host "- ✅ /ru и /ru/pricing → 200 OK" -ForegroundColor Green
Write-Host "- ✅ /ok → 200 OK + Cache-Control: no-store" -ForegroundColor Green
Write-Host "- ✅ / → 301/308 на /ru" -ForegroundColor Green
Write-Host "- ✅ Security headers присутствуют" -ForegroundColor Green
