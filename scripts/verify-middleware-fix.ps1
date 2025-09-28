# Команды для проверки деплоя после исправления middleware

Write-Host "🔍 Проверка исправления middleware..." -ForegroundColor Cyan
Write-Host ""

# Замените <your-vercel-domain> на реальный домен из Vercel
$vercelDomain = "life-undo.vercel.app"  # Замените на ваш реальный домен
$prodDomain = "lifeundo.ru"

Write-Host "📋 Проверка Vercel домена ($vercelDomain):" -ForegroundColor Yellow
Write-Host ""

$urls = @(
    "/",
    "/ru",
    "/ping",
    "/ru/pricing", 
    "/ru/support",
    "/ru/use-cases",
    "/ru/fund/apply",
    "/ru/privacy",
    "/ok"
)

foreach ($url in $urls) {
    $fullUrl = "https://$vercelDomain" + $url
    Write-Host "==== $url" -ForegroundColor Green
    
    try {
        $response = Invoke-WebRequest -Uri $fullUrl -Method Head -UseBasicParsing -TimeoutSec 10
        
        # Проверка статуса
        $statusColor = if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 301 -or $response.StatusCode -eq 308) { "Green" } else { "Red" }
        Write-Host "  Status: $($response.StatusCode)" -ForegroundColor $statusColor
        
        # Проверка редиректа для корня
        if ($url -eq "/" -and ($response.StatusCode -eq 301 -or $response.StatusCode -eq 308)) {
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
        
    } catch {
        Write-Host "  ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

Write-Host "📋 Проверка продакшн домена ($prodDomain):" -ForegroundColor Yellow
Write-Host ""

foreach ($url in $urls) {
    $fullUrl = "https://$prodDomain" + $url
    Write-Host "==== $url" -ForegroundColor Green
    
    try {
        $response = Invoke-WebRequest -Uri $fullUrl -Method Head -UseBasicParsing -TimeoutSec 10
        
        # Проверка статуса
        $statusColor = if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 301 -or $response.StatusCode -eq 308) { "Green" } else { "Red" }
        Write-Host "  Status: $($response.StatusCode)" -ForegroundColor $statusColor
        
        # Проверка редиректа для корня
        if ($url -eq "/" -and ($response.StatusCode -eq 301 -or $response.StatusCode -eq 308)) {
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
        
    } catch {
        Write-Host "  ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

Write-Host "✅ Проверка завершена!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Что проверить дополнительно:" -ForegroundColor Yellow
Write-Host "1. Открыть https://$vercelDomain/ru в браузере - должна открыться главная" -ForegroundColor White
Write-Host "2. Открыть https://$prodDomain/ru в браузере - должна открыться главная" -ForegroundColor White
Write-Host "3. Проверить https://$vercelDomain/ping - должна открыться тестовая страница" -ForegroundColor White
Write-Host "4. Убедиться, что все страницы /ru/* открываются корректно" -ForegroundColor White
