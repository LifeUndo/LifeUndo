# LifeUndo Production Monitoring Script
param(
    [string]$Domain = "https://getlifeundo.com"
)

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Write-Host "LifeUndo Production Monitoring - $timestamp"

# Check main pages
$pages = @("/", "/ru", "/en", "/ru/about", "/en/features", "/ru/pricing", "/en/downloads", "/ru/contact", "/en/support", "/ru/license")

foreach ($page in $pages) {
    try {
        $response = Invoke-WebRequest -Uri "$Domain$page" -Method Head -TimeoutSec 10
        $status = $response.StatusCode
        
        if ($status -eq 200) {
            Write-Host "OK: $page - $status" -ForegroundColor Green
        } else {
            Write-Host "ERROR: $page - $status" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "FAILED: $page - Connection error" -ForegroundColor Red
    }
}

# Check static files
$static = @("/favicon.ico", "/robots.txt", "/sitemap.xml")

foreach ($file in $static) {
    try {
        $response = Invoke-WebRequest -Uri "$Domain$file" -Method Head -TimeoutSec 10
        $status = $response.StatusCode
        
        if ($status -eq 200) {
            Write-Host "OK: $file - $status" -ForegroundColor Green
        } else {
            Write-Host "ERROR: $file - $status" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "FAILED: $file - Connection error" -ForegroundColor Red
    }
}

# Check CSP
try {
    $response = Invoke-WebRequest -Uri $Domain -Method Head -TimeoutSec 10
    $csp = $response.Headers['Content-Security-Policy']
    
    if ($csp -match 'unsafe-eval') {
        Write-Host "WARNING: CSP contains unsafe-eval" -ForegroundColor Yellow
    } else {
        Write-Host "OK: CSP clean - no unsafe-eval" -ForegroundColor Green
    }
}
catch {
    Write-Host "FAILED: CSP check error" -ForegroundColor Red
}

Write-Host "Monitoring complete - $timestamp"
