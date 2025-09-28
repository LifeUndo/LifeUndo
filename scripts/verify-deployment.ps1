# Скрипт для проверки деплоя после настройки Vercel
# Запуск: .\scripts\verify-deployment.ps1

Write-Host "🔍 Проверка деплоя LifeUndo..." -ForegroundColor Cyan
Write-Host ""

$baseUrl = "https://lifeundo.ru"
$urls = @(
    "/",
    "/ru",
    "/ru/pricing", 
    "/ru/support",
    "/ru/use-cases",
    "/ru/fund/apply",
    "/ru/privacy",
    "/ok"
)

Write-Host "📋 Проверка редиректов и статусов:" -ForegroundColor Yellow
Write-Host ""

foreach ($url in $urls) {
    $fullUrl = $baseUrl + $url
    Write-Host "==== $url" -ForegroundColor Green
    
    try {
        $response = Invoke-WebRequest -Uri $fullUrl -Method Head -UseBasicParsing -TimeoutSec 10
        
        # Проверка статуса
        $statusColor = if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 301) { "Green" } else { "Red" }
        Write-Host "  Status: $($response.StatusCode)" -ForegroundColor $statusColor
        
        # Проверка редиректа для корня
        if ($url -eq "/" -and $response.StatusCode -eq 301) {
            $location = $response.Headers.Location
            Write-Host "  Redirect: $location" -ForegroundColor Cyan
        }
        
        # Проверка кэширования для /ok
        if ($url -eq "/ok") {
            $cacheControl = $response.Headers["Cache-Control"]
            if ($cacheControl -like "*no-store*") {
                Write-Host "  Cache-Control: ✅ $cacheControl" -ForegroundColor Green
            } else {
                Write-Host "  Cache-Control: ❌ $cacheControl" -ForegroundColor Red
            }
        }
        
        # Проверка security headers
        if ($url -eq "/ru") {
            $securityHeaders = @("X-Frame-Options", "X-Content-Type-Options", "Referrer-Policy", "Strict-Transport-Security")
            foreach ($header in $securityHeaders) {
                $value = $response.Headers[$header]
                if ($value) {
                    Write-Host "  $header: ✅ $value" -ForegroundColor Green
                } else {
                    Write-Host "  $header: ❌ Missing" -ForegroundColor Red
                }
            }
        }
        
    } catch {
        Write-Host "  ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

Write-Host "📱 Проверка дополнительных файлов:" -ForegroundColor Yellow

# Проверка robots.txt и sitemap.xml
$additionalFiles = @("/robots.txt", "/sitemap.xml")

foreach ($file in $additionalFiles) {
    $fullUrl = $baseUrl + $file
    try {
        $response = Invoke-WebRequest -Uri $fullUrl -Method Head -UseBasicParsing -TimeoutSec 10
        Write-Host "  $file: ✅ $($response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "  $file: ❌ Error" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "✅ Проверка завершена!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Что проверить дополнительно:" -ForegroundColor Yellow
Write-Host "1. Открыть https://lifeundo.ru в браузере - должен перенаправить на /ru" -ForegroundColor White
Write-Host "2. Проверить мобильную версию - LanguageSwitcher должен работать корректно" -ForegroundColor White
Write-Host "3. Проверить все страницы навигации" -ForegroundColor White
Write-Host "4. Убедиться, что нет ошибок в консоли браузера" -ForegroundColor White
