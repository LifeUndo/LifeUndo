# post-fix-check.ps1
# Простой curl-чек 200/401

param(
    [Parameter(Mandatory=$true)]
    [string]$Url
)

Write-Host "🧪 Запуск HTTP проверки для $Url" -ForegroundColor Cyan

$pages = @(
    @{ path = "/"; expected = 200; name = "Главная" },
    @{ path = "/fund"; expected = 200; name = "Фонд" },
    @{ path = "/ok"; expected = 200; name = "Маркер" },
    @{ path = "/admin"; expected = 401; name = "Админка" }
)

foreach ($page in $pages) {
    $testUrl = "$Url$($page.path)"
    Write-Host "Проверка $($page.name) ($testUrl)..." -NoNewline -ForegroundColor Green
    
    try {
        $response = Invoke-WebRequest -Uri $testUrl -Method HEAD -MaximumRedirection 0 -ErrorAction Stop
        if ($response.StatusCode -eq $page.expected) {
            Write-Host " ✅ $($response.StatusCode) OK" -ForegroundColor Green
        } else {
            Write-Host " ❌ Ошибка: $($response.StatusCode) (ожидался $($page.expected))" -ForegroundColor Red
        }
    } catch {
        Write-Host " ❌ Ошибка: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "✅ HTTP проверка завершена." -ForegroundColor Green