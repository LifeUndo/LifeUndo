# Pre-release validation script
# Проверяет готовность к релизу перед публикацией

Write-Host "Pre-release validation started..." -ForegroundColor Cyan

$errors = @()
$warnings = @()

# 1. Проверка Firefox сборки
Write-Host "`nChecking Firefox build..." -ForegroundColor Yellow
if (Test-Path "dist-ff") {
    Write-Host "dist-ff directory exists" -ForegroundColor Green
} else {
    $errors += "dist-ff directory missing"
}

if (Test-Path "dist-ff/manifest.json") {
    Write-Host "Firefox manifest.json exists" -ForegroundColor Green
} else {
    $errors += "Firefox manifest.json missing"
}

if (Test-Path "dist-ff/background.js") {
    Write-Host "Firefox background.js exists" -ForegroundColor Green
} else {
    $errors += "Firefox background.js missing"
}

# 2. Проверка web-ext lint
Write-Host "`nRunning web-ext lint..." -ForegroundColor Yellow
try {
    $lintResult = npm run ff:lint 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "web-ext lint passed" -ForegroundColor Green
    } else {
        $warnings += "web-ext lint has warnings (non-critical)"
        Write-Host "web-ext lint warnings:" -ForegroundColor Yellow
        Write-Host $lintResult -ForegroundColor Gray
    }
} catch {
    $errors += "web-ext lint failed: $($_.Exception.Message)"
}

# 3. Проверка структуры релизов
Write-Host "`nChecking release structure..." -ForegroundColor Yellow
if (Test-Path "public/app/latest/latest.json") {
    Write-Host "latest.json exists" -ForegroundColor Green
    
    try {
        $latestJson = Get-Content "public/app/latest/latest.json" | ConvertFrom-Json
        if ($latestJson.version) {
            Write-Host "latest.json has version: $($latestJson.version)" -ForegroundColor Green
        } else {
            $errors += "latest.json missing version field"
        }
    } catch {
        $errors += "latest.json is invalid JSON"
    }
} else {
    $errors += "latest.json missing"
}

if (Test-Path "public/app/0.3.7.12") {
    Write-Host "Version 0.3.7.12 directory exists" -ForegroundColor Green
} else {
    $warnings += "Version 0.3.7.12 directory missing"
}

# 4. Проверка сайта (если dev сервер запущен)
Write-Host "`nChecking website..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/healthz" -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "Dev server is running" -ForegroundColor Green
        
        # Проверка downloads страницы
        try {
            $downloadsResponse = Invoke-WebRequest -Uri "http://localhost:3000/ru/downloads" -TimeoutSec 5 -ErrorAction SilentlyContinue
            if ($downloadsResponse.StatusCode -eq 200) {
                Write-Host "Downloads page accessible" -ForegroundColor Green
            } else {
                $warnings += "Downloads page not accessible"
            }
        } catch {
            $warnings += "Downloads page check failed"
        }
    } else {
        $warnings += "Dev server not running (start with: npm run dev)"
    }
} catch {
    $warnings += "Dev server not accessible (start with: npm run dev)"
}

# 5. Проверка FreeKassa конфигурации
Write-Host "`nChecking FreeKassa config..." -ForegroundColor Yellow
try {
    $fkResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/debug/fk" -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($fkResponse.StatusCode -eq 200) {
        $fkData = $fkResponse.Content | ConvertFrom-Json
        if ($fkData.ok -eq $true) {
            Write-Host "FreeKassa config OK" -ForegroundColor Green
        } else {
            $warnings += "FreeKassa config issues"
        }
    } else {
        $warnings += "FreeKassa debug endpoint not accessible"
    }
} catch {
    $warnings += "FreeKassa check failed"
}

# 6. Проверка pricing страницы
Write-Host "`nChecking pricing page..." -ForegroundColor Yellow
try {
    $pricingResponse = Invoke-WebRequest -Uri "http://localhost:3000/ru/pricing" -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($pricingResponse.StatusCode -eq 200) {
        if ($pricingResponse.Content -notmatch "Invalid plan") {
            Write-Host "Pricing page OK (no 'Invalid plan' errors)" -ForegroundColor Green
        } else {
            $errors += "Pricing page has 'Invalid plan' errors"
        }
    } else {
        $warnings += "Pricing page not accessible"
    }
} catch {
    $warnings += "Pricing page check failed"
}

# Результаты
Write-Host "`nValidation Results:" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan

if ($errors.Count -eq 0) {
    Write-Host "No critical errors found!" -ForegroundColor Green
} else {
    Write-Host "Critical errors found:" -ForegroundColor Red
    foreach ($error in $errors) {
        Write-Host "  $error" -ForegroundColor Red
    }
}

if ($warnings.Count -gt 0) {
    Write-Host "`nWarnings:" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host "  $warning" -ForegroundColor Yellow
    }
}

# Финальный статус
Write-Host "`nFinal Status:" -ForegroundColor Cyan
if ($errors.Count -eq 0) {
    Write-Host "READY FOR RELEASE!" -ForegroundColor Green
    Write-Host "You can proceed with AMO submission and production deployment." -ForegroundColor Green
    exit 0
} else {
    Write-Host "NOT READY FOR RELEASE" -ForegroundColor Red
    Write-Host "Please fix the critical errors before proceeding." -ForegroundColor Red
    exit 1
}