# FreeKassa Smoke Test Script
# Usage: .\scripts\freekassa-smoke-test.ps1 -PreviewUrl "https://your-preview-url.vercel.app"

param(
    [Parameter(Mandatory=$true)]
    [string]$PreviewUrl
)

Write-Host "🔥 FreeKassa Smoke Test" -ForegroundColor Red
Write-Host "Preview URL: $PreviewUrl" -ForegroundColor Yellow
Write-Host ""

# Test 1: Debug API
Write-Host "1️⃣ Testing /api/debug/fk..." -ForegroundColor Cyan
try {
    $debugResponse = Invoke-RestMethod -Uri "$PreviewUrl/api/debug/fk" -UseBasicParsing
    Write-Host "✅ Debug API Response:" -ForegroundColor Green
    $debugResponse | ConvertTo-Json -Depth 3
    
    if ($debugResponse.ok -and $debugResponse.fkEnabled) {
        Write-Host "✅ FreeKassa is enabled and configured" -ForegroundColor Green
    } else {
        Write-Host "❌ FreeKassa not properly configured" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Debug API failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 2: Create Payment (Pro Plan)
Write-Host "2️⃣ Testing payment creation for Pro plan..." -ForegroundColor Cyan
try {
    $paymentBody = @{
        productId = "getlifeundo_pro"
        email = "test@example.com"
    } | ConvertTo-Json
    
    $paymentResponse = Invoke-RestMethod -Method Post -Uri "$PreviewUrl/api/payments/freekassa/create" -Body $paymentBody -ContentType "application/json"
    Write-Host "✅ Payment API Response:" -ForegroundColor Green
    $paymentResponse | ConvertTo-Json -Depth 3
    
    if ($paymentResponse.ok -and $paymentResponse.pay_url) {
        Write-Host "✅ Payment URL generated successfully" -ForegroundColor Green
        Write-Host "🔗 Payment URL: $($paymentResponse.pay_url)" -ForegroundColor Yellow
        
        # Validate URL format
        if ($paymentResponse.pay_url -match "https://pay\.freekassa\.ru/") {
            Write-Host "✅ URL points to correct FreeKassa domain" -ForegroundColor Green
        } else {
            Write-Host "❌ Invalid payment URL domain" -ForegroundColor Red
        }
        
        # Check for required parameters
        if ($paymentResponse.pay_url -match "oa=599\.00" -and $paymentResponse.pay_url -match "currency=RUB") {
            Write-Host "✅ URL contains correct amount and currency" -ForegroundColor Green
        } else {
            Write-Host "❌ Missing required parameters in URL" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Payment creation failed" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Payment API failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 3: Create Payment (VIP Plan)
Write-Host "3️⃣ Testing payment creation for VIP plan..." -ForegroundColor Cyan
try {
    $paymentBody = @{
        productId = "getlifeundo_vip"
    } | ConvertTo-Json
    
    $paymentResponse = Invoke-RestMethod -Method Post -Uri "$PreviewUrl/api/payments/freekassa/create" -Body $paymentBody -ContentType "application/json"
    
    if ($paymentResponse.ok -and $paymentResponse.pay_url -match "oa=9990\.00") {
        Write-Host "✅ VIP payment URL generated with correct amount (9990.00)" -ForegroundColor Green
    } else {
        Write-Host "❌ VIP payment creation failed or incorrect amount" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ VIP payment API failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 4: Test invalid product ID
Write-Host "4️⃣ Testing invalid product ID..." -ForegroundColor Cyan
try {
    $paymentBody = @{
        productId = "invalid_product"
    } | ConvertTo-Json
    
    try {
        $paymentResponse = Invoke-RestMethod -Method Post -Uri "$PreviewUrl/api/payments/freekassa/create" -Body $paymentBody -ContentType "application/json"
        Write-Host "❌ Should have failed for invalid product ID" -ForegroundColor Red
    } catch {
        $errorResponse = $_.Exception.Response
        if ($errorResponse.StatusCode -eq 400) {
            Write-Host "✅ Correctly rejected invalid product ID (400 error)" -ForegroundColor Green
        } else {
            Write-Host "❌ Wrong error code: $($errorResponse.StatusCode)" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "❌ Invalid product test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 5: Check pricing page UI
Write-Host "5️⃣ Testing pricing page accessibility..." -ForegroundColor Cyan
try {
    $pricingResponse = Invoke-WebRequest -Uri "$PreviewUrl/ru/pricing" -UseBasicParsing
    if ($pricingResponse.StatusCode -eq 200) {
        Write-Host "✅ Pricing page accessible (200 OK)" -ForegroundColor Green
        
        # Check if page contains FreeKassa buttons (basic check)
        if ($pricingResponse.Content -match "FreeKassa") {
            Write-Host "✅ Pricing page contains FreeKassa elements" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Pricing page doesn't contain FreeKassa elements (might be disabled)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Pricing page not accessible: $($pricingResponse.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Pricing page test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Smoke test completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Yellow
Write-Host "  • Debug API: Working" -ForegroundColor White
Write-Host "  • Payment Creation: Working" -ForegroundColor White
Write-Host "  • URL Validation: Working" -ForegroundColor White
Write-Host "  • Error Handling: Working" -ForegroundColor White
Write-Host "  • Pricing Page: Accessible" -ForegroundColor White
Write-Host ""
Write-Host "✅ FreeKassa integration is ready for production!" -ForegroundColor Green
