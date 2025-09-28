# Скрипт для проверки исправления продакшена lifeundo.ru
# Запускать после исправления настроек в Vercel

Write-Host "🚀 Проверка исправления продакшена lifeundo.ru" -ForegroundColor Green
Write-Host ""

# Функция для проверки URL
function Test-Url {
    param(
        [string]$Url,
        [string]$ExpectedStatus,
        [string]$Description
    )
    
    Write-Host "Проверяю: $Description" -ForegroundColor Yellow
    Write-Host "URL: $Url" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method Head -UseBasicParsing -TimeoutSec 10
        $status = $response.StatusCode
        $headers = $response.Headers
        
        if ($status -eq $ExpectedStatus) {
            Write-Host "✅ $Description - OK ($status)" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ $Description - ОШИБКА ($status, ожидался $ExpectedStatus)" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "❌ $Description - ОШИБКА: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
    Write-Host ""
}

# Функция для проверки редиректа
function Test-Redirect {
    param(
        [string]$Url,
        [string]$ExpectedLocation,
        [string]$Description
    )
    
    Write-Host "Проверяю редирект: $Description" -ForegroundColor Yellow
    Write-Host "URL: $Url" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method Head -UseBasicParsing -TimeoutSec 10 -MaximumRedirection 0
        Write-Host "❌ Редирект не сработал (статус: $($response.StatusCode))" -ForegroundColor Red
        return $false
    }
    catch {
        if ($_.Exception.Response) {
            $status = $_.Exception.Response.StatusCode.value__
            $location = $_.Exception.Response.Headers.Location
            
            if ($status -eq 308 -or $status -eq 301 -or $status -eq 302) {
                if ($location -like "*$ExpectedLocation*") {
                    Write-Host "✅ $Description - OK ($status -> $location)" -ForegroundColor Green
                    return $true
                } else {
                    Write-Host "❌ $Description - ОШИБКА (редирект на $location, ожидался $ExpectedLocation)" -ForegroundColor Red
                    return $false
                }
            } else {
                Write-Host "❌ $Description - ОШИБКА (статус: $status)" -ForegroundColor Red
                return $false
            }
        } else {
            Write-Host "❌ $Description - ОШИБКА: $($_.Exception.Message)" -ForegroundColor Red
            return $false
        }
    }
    Write-Host ""
}

# Функция для проверки заголовков
function Test-Headers {
    param(
        [string]$Url,
        [hashtable]$ExpectedHeaders,
        [string]$Description
    )
    
    Write-Host "Проверяю заголовки: $Description" -ForegroundColor Yellow
    Write-Host "URL: $Url" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method Head -UseBasicParsing -TimeoutSec 10
        $headers = $response.Headers
        $allGood = $true
        
        foreach ($headerName in $ExpectedHeaders.Keys) {
            $expectedValue = $ExpectedHeaders[$headerName]
            $actualValue = $headers[$headerName]
            
            if ($actualValue -like "*$expectedValue*") {
                Write-Host "✅ $headerName: $actualValue" -ForegroundColor Green
            } else {
                Write-Host "❌ $headerName: $actualValue (ожидался: $expectedValue)" -ForegroundColor Red
                $allGood = $false
            }
        }
        
        if ($allGood) {
            Write-Host "✅ $Description - Все заголовки OK" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ $Description - Проблемы с заголовками" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "❌ $Description - ОШИБКА: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
    Write-Host ""
}

# Основные проверки
Write-Host "=== ОСНОВНЫЕ ПРОВЕРКИ ===" -ForegroundColor Cyan

$results = @()

# 1. Проверка редиректа корня
$results += Test-Redirect -Url "https://lifeundo.ru/" -ExpectedLocation "/ru" -Description "Редирект корня на /ru"

# 2. Проверка главной страницы
$results += Test-Url -Url "https://lifeundo.ru/ru" -ExpectedStatus 200 -Description "Главная страница /ru"

# 3. Проверка страницы тарифов
$results += Test-Url -Url "https://lifeundo.ru/ru/pricing" -ExpectedStatus 200 -Description "Страница тарифов /ru/pricing"

# 4. Проверка страницы поддержки
$results += Test-Url -Url "https://lifeundo.ru/ru/support" -ExpectedStatus 200 -Description "Страница поддержки /ru/support"

# 5. Проверка /ok с заголовками
$okHeaders = @{
    "Cache-Control" = "no-store, no-cache, must-revalidate"
    "Pragma" = "no-cache"
}
$results += Test-Headers -Url "https://lifeundo.ru/ok" -ExpectedHeaders $okHeaders -Description "Страница /ok с правильными заголовками"

# 6. Проверка API healthz
$results += Test-Url -Url "https://lifeundo.ru/api/healthz" -ExpectedStatus 200 -Description "API healthz"

# 7. Проверка тестовой страницы
$results += Test-Url -Url "https://lifeundo.ru/ping" -ExpectedStatus 200 -Description "Тестовая страница /ping"

Write-Host "=== ДОПОЛНИТЕЛЬНЫЕ ПРОВЕРКИ ===" -ForegroundColor Cyan

# 8. Проверка других важных страниц
$additionalPages = @(
    @{Url="https://lifeundo.ru/ru/use-cases"; Description="Страница кейсов"},
    @{Url="https://lifeundo.ru/ru/fund/apply"; Description="Страница фонда"},
    @{Url="https://lifeundo.ru/ru/privacy"; Description="Страница приватности"},
    @{Url="https://lifeundo.ru/ru/terms"; Description="Страница условий"},
    @{Url="https://lifeundo.ru/ru/faq"; Description="Страница FAQ"}
)

foreach ($page in $additionalPages) {
    $results += Test-Url -Url $page.Url -ExpectedStatus 200 -Description $page.Description
}

# Итоговый результат
Write-Host "=== ИТОГОВЫЙ РЕЗУЛЬТАТ ===" -ForegroundColor Cyan
$successCount = ($results | Where-Object { $_ -eq $true }).Count
$totalCount = $results.Count

Write-Host "Успешно: $successCount из $totalCount проверок" -ForegroundColor $(if ($successCount -eq $totalCount) { "Green" } else { "Yellow" })

if ($successCount -eq $totalCount) {
    Write-Host ""
    Write-Host "🎉 ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ! Продакшен работает корректно." -ForegroundColor Green
    Write-Host ""
    Write-Host "Пруфы для релиза:" -ForegroundColor Cyan
    Write-Host "✅ Редирект / → /ru работает" -ForegroundColor Green
    Write-Host "✅ Все страницы /ru/* возвращают 200 OK" -ForegroundColor Green
    Write-Host "✅ /ok возвращает правильные Cache-Control заголовки" -ForegroundColor Green
    Write-Host "✅ API и тестовые роуты работают" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "⚠️ ЕСТЬ ПРОБЛЕМЫ! Проверьте настройки в Vercel." -ForegroundColor Red
    Write-Host ""
    Write-Host "Возможные причины:" -ForegroundColor Yellow
    Write-Host "• Домен не привязан к правильному проекту" -ForegroundColor Yellow
    Write-Host "• Последний деплой не получил прод-алиас" -ForegroundColor Yellow
    Write-Host "• Проблемы с DNS или SSL" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Скрипт завершен. Время: $(Get-Date)" -ForegroundColor Gray