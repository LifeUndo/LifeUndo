# Check Deploy Script
# Verifies critical endpoints after deployment

$P="https://getlifeundo.com"

Write-Host "=== GetLifeUndo Deployment Check ===" -ForegroundColor Green
Write-Host "Checking endpoints at: $P" -ForegroundColor Yellow
Write-Host ""

# ChatGPT Actions endpoints
Write-Host "Checking ChatGPT Actions endpoints..." -ForegroundColor Cyan
try {
    $aiPlugin = (iwr "$P/.well-known/ai-plugin.json" -UseBasicParsing).StatusCode
    Write-Host "✓ ai-plugin.json: $aiPlugin" -ForegroundColor Green
} catch {
    Write-Host "✗ ai-plugin.json: Failed" -ForegroundColor Red
}

try {
    $openapi = (iwr "$P/openapi.yaml" -UseBasicParsing).StatusCode
    Write-Host "✓ openapi.yaml: $openapi" -ForegroundColor Green
} catch {
    Write-Host "✗ openapi.yaml: Failed" -ForegroundColor Red
}

# Main pages
Write-Host "`nChecking main pages..." -ForegroundColor Cyan
try {
    $ru = (iwr "$P/ru" -UseBasicParsing).StatusCode
    Write-Host "✓ /ru: $ru" -ForegroundColor Green
} catch {
    Write-Host "✗ /ru: Failed" -ForegroundColor Red
}

try {
    $en = (iwr "$P/en" -UseBasicParsing).StatusCode
    Write-Host "✓ /en: $en" -ForegroundColor Green
} catch {
    Write-Host "✗ /en: Failed" -ForegroundColor Red
}

# New pages
Write-Host "`nChecking developers and partners pages..." -ForegroundColor Cyan
try {
    $dev = (iwr "$P/ru/developers" -UseBasicParsing).StatusCode
    Write-Host "✓ /ru/developers: $dev" -ForegroundColor Green
} catch {
    Write-Host "✗ /ru/developers: Failed" -ForegroundColor Red
}

try {
    $partners = (iwr "$P/ru/partners" -UseBasicParsing).StatusCode
    Write-Host "✓ /ru/partners: $partners" -ForegroundColor Green
} catch {
    Write-Host "✗ /ru/partners: Failed" -ForegroundColor Red
}

# Legal downloads
Write-Host "`nChecking legal downloads page..." -ForegroundColor Cyan
try {
    $legal = (iwr "$P/ru/legal/downloads" -UseBasicParsing).StatusCode
    Write-Host "✓ /ru/legal/downloads: $legal" -ForegroundColor Green
} catch {
    Write-Host "✗ /ru/legal/downloads: Failed" -ForegroundColor Red
}

# Downloads page AMO link
Write-Host "`nChecking downloads page for AMO link..." -ForegroundColor Cyan
try {
    $downloads = (iwr "$P/ru/downloads" -UseBasicParsing).Content
    if ($downloads -match "addons.mozilla.org") {
        Write-Host "✓ AMO link found on downloads page" -ForegroundColor Green
    } else {
        Write-Host "✗ AMO link not found on downloads page" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Downloads page check failed" -ForegroundColor Red
}

# FreeKassa API
Write-Host "`nChecking FreeKassa API..." -ForegroundColor Cyan
try {
    $r = irm -Method POST "$P/api/payments/freekassa/create" -ContentType "application/json" -Body (@{productId="pro_month"}|ConvertTo-Json -Compress)
    if ($r.ok) {
        Write-Host "✓ FreeKassa Pro payment: OK" -ForegroundColor Green
        Write-Host "  Pay URL: $($r.pay_url)" -ForegroundColor Gray
    } else {
        Write-Host "✗ FreeKassa Pro payment: Failed" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ FreeKassa Pro payment: Error" -ForegroundColor Red
}

try {
    $r = irm -Method POST "$P/api/payments/freekassa/create" -ContentType "application/json" -Body (@{productId="vip_lifetime"}|ConvertTo-Json -Compress)
    if ($r.ok) {
        Write-Host "✓ FreeKassa VIP payment: OK" -ForegroundColor Green
        Write-Host "  Pay URL: $($r.pay_url)" -ForegroundColor Gray
    } else {
        Write-Host "✗ FreeKassa VIP payment: Failed" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ FreeKassa VIP payment: Error" -ForegroundColor Red
}

# Health check
Write-Host "`nChecking health endpoint..." -ForegroundColor Cyan
try {
    $health = (iwr "$P/api/healthz" -UseBasicParsing).StatusCode
    Write-Host "✓ /api/healthz: $health" -ForegroundColor Green
} catch {
    Write-Host "✗ /api/healthz: Failed" -ForegroundColor Red
}

Write-Host "`n=== Deployment Check Complete ===" -ForegroundColor Green
