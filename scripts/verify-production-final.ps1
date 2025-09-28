# Автоматическая проверка продакшена lifeundo.ru
# Запускать ПОСЛЕ исправления привязки домена в Vercel

Write-Host "🚀 Проверка продакшена lifeundo.ru" -ForegroundColor Green
Write-Host ""

# Функция для проверки URL
function Test-Url {
    param(
        [string]$Url,
        [string]$ExpectedStatus,
        [string]$Description,
        [string[]]$RequiredHeaders = @()
    )
    
    Write-Host "Проверяю: $Description" -ForegroundColor Yellow
    Write-Host "URL: $Url" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method Head -UseBasicParsing -TimeoutSec 10
        $status = $response.StatusCode
        $headers = $response.Headers
        
        if ($status -eq $ExpectedStatus) {
            Write-Host "✅ $Description - OK ($status)" -ForegroundColor Green
            
            # Проверка заголовков
            foreach ($header in $RequiredHeaders) {
                if ($headers.ContainsKey($header)) {
                    Write-Host "  ✅ $header : $($headers[$header])" -ForegroundColor Green
                } else {
                    Write-Host "  ❌ Отсутствует заголовок: $header" -ForegroundColor Red
                }
            }
            
            return $true
        } else {
            Write-Host "❌ $Description - ОШИБКА ($status, ожидался $ExpectedStatus)" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ $Description - ОШИБКА: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Функция для проверки содержимого
function Test-Content {
    param(
        [string]$Url,
        [string]$ExpectedContent,
        [string]$Description
    )
    
    Write-Host "Проверяю содержимое: $Description" -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 10
        $content = $response.Content
        
        if ($content -like "*$ExpectedContent*") {
            Write-Host "✅ $Description - OK (содержит '$ExpectedContent')" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ $Description - ОШИБКА (не содержит '$ExpectedContent')" -ForegroundColor Red
            Write-Host "Содержимое: $($content.Substring(0, [Math]::Min(200, $content.Length)))..." -ForegroundColor Gray
            return $false
        }
    } catch {
        Write-Host "❌ $Description - ОШИБКА: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Основные проверки
Write-Host "=== ОСНОВНЫЕ URL ===" -ForegroundColor Cyan

$results = @()

# Проверка редиректа корня
$results += Test-Url "https://lifeundo.ru/" "308" "Редирект корня на /ru"

# Проверка главной страницы
$results += Test-Url "https://lifeundo.ru/ru" "200" "Главная страница"

# Проверка тарифов
$results += Test-Url "https://lifeundo.ru/ru/pricing" "200" "Страница тарифов"

# Проверка поддержки
$results += Test-Url "https://lifeundo.ru/ru/support" "200" "Страница поддержки"

# Проверка кейсов
$results += Test-Url "https://lifeundo.ru/ru/use-cases" "200" "Страница кейсов"

Write-Host ""
Write-Host "=== ТЕХНИЧЕСКИЕ URL ===" -ForegroundColor Cyan

# Проверка /ok с заголовками
$results += Test-Url "https://lifeundo.ru/ok" "200" "Техническая страница /ok" @("Cache-Control", "Pragma")

# Проверка robots.txt
$results += Test-Content "https://lifeundo.ru/robots.txt" "lifeundo.ru" "robots.txt содержит правильный домен"

# Проверка sitemap.xml
$results += Test-Content "https://lifeundo.ru/sitemap.xml" "lifeundo.ru" "sitemap.xml содержит правильный домен"

Write-Host ""
Write-Host "=== ИТОГОВЫЙ РЕЗУЛЬТАТ ===" -ForegroundColor Cyan

$successCount = ($results | Where-Object { $_ -eq $true }).Count
$totalCount = $results.Count

Write-Host "Успешно: $successCount из $totalCount" -ForegroundColor $(if ($successCount -eq $totalCount) { "Green" } else { "Yellow" })

if ($successCount -eq $totalCount) {
    Write-Host "🎉 ВСЕ ПРОВЕРКИ ПРОШЛИ УСПЕШНО!" -ForegroundColor Green
    Write-Host "Продакшен готов к работе!" -ForegroundColor Green
} else {
    Write-Host "⚠️ Есть проблемы, требующие исправления" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Для детальной проверки откройте браузер и проверьте:"
Write-Host "- https://lifeundo.ru/ru (главная страница)"
Write-Host "- https://lifeundo.ru/ru/pricing (тарифы)"
Write-Host "- https://lifeundo.ru/ok (техническая страница)"
