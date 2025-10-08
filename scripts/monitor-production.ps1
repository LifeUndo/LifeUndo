# LifeUndo Production Monitoring Script
# Запускать каждые 15 минут в течение 48 часов

param(
    [string]$Domain = "https://getlifeundo.com",
    [string]$LogFile = "monitoring.log"
)

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

Write-Host "🔍 LifeUndo Production Monitoring - $timestamp" -ForegroundColor Green

# Проверка основных страниц
$pages = @("/", "/ru", "/en", "/ru/about", "/en/features", "/ru/pricing", "/en/downloads", "/ru/contact", "/en/support", "/ru/license", "/en/blog", "/ru/partner")

foreach ($page in $pages) {
    try {
        $response = Invoke-WebRequest -Uri "$Domain$page" -Method Head -TimeoutSec 10
        $status = $response.StatusCode
        
        if ($status -eq 200) {
            Write-Host "✅ $page - $status" -ForegroundColor Green
        } elseif ($status -ge 400) {
            Write-Host "❌ $page - $status" -ForegroundColor Red
            "$timestamp - ERROR: $page returned $status" | Add-Content $LogFile
        } else {
            Write-Host "⚠️ $page - $status" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "💥 $page - Connection failed: $($_.Exception.Message)" -ForegroundColor Red
        "$timestamp - CONNECTION ERROR: $page - $($_.Exception.Message)" | Add-Content $LogFile
    }
}

# Проверка статики
$static = @("/favicon.ico", "/robots.txt", "/sitemap.xml")

foreach ($file in $static) {
    try {
        $response = Invoke-WebRequest -Uri "$Domain$file" -Method Head -TimeoutSec 10
        $status = $response.StatusCode
        
        if ($status -eq 200) {
            Write-Host "✅ $file - $status" -ForegroundColor Green
        } else {
            Write-Host "❌ $file - $status" -ForegroundColor Red
            "$timestamp - STATIC ERROR: $file returned $status" | Add-Content $LogFile
        }
    }
    catch {
        Write-Host "💥 $file - Connection failed" -ForegroundColor Red
        "$timestamp - STATIC CONNECTION ERROR: $file" | Add-Content $LogFile
    }
}

# Проверка CSP
try {
    $response = Invoke-WebRequest -Uri $Domain -Method Head -TimeoutSec 10
    $csp = $response.Headers['Content-Security-Policy']
    
    if ($csp -match 'unsafe-eval') {
        Write-Host "⚠️ CSP still contains unsafe-eval" -ForegroundColor Yellow
        "$timestamp - CSP WARNING: unsafe-eval detected" | Add-Content $LogFile
    } else {
        Write-Host "✅ CSP clean - no unsafe-eval" -ForegroundColor Green
    }
}
catch {
        Write-Host "CSP check failed" -ForegroundColor Red
    "$timestamp - CSP CHECK ERROR" | Add-Content $LogFile
}

Write-Host "`n📊 Monitoring complete - $timestamp" -ForegroundColor Cyan
Write-Host "Log file: $LogFile" -ForegroundColor Gray
