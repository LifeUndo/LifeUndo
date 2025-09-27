# Demo Smoke Test Script
# Tests the demo version functionality

param(
    [Parameter(Mandatory=$true)]
    [string]$DemoUrl
)

Write-Host "🧪 LifeUndo Demo Smoke Test" -ForegroundColor Cyan
Write-Host "🔗 Testing: $DemoUrl" -ForegroundColor Yellow
Write-Host ""

# Test 1: Main demo page
Write-Host "1️⃣ Testing main demo page..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$DemoUrl/demo" -Method GET
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Main demo page loads successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Main demo page failed: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Main demo page error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 2: Features page
Write-Host "2️⃣ Testing features page..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$DemoUrl/demo/features" -Method GET
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Features page loads successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Features page failed: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Features page error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 3: Pricing page
Write-Host "3️⃣ Testing pricing page..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$DemoUrl/demo/pricing" -Method GET
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Pricing page loads successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Pricing page failed: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Pricing page error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 4: FAQ page
Write-Host "4️⃣ Testing FAQ page..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$DemoUrl/demo/faq" -Method GET
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ FAQ page loads successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ FAQ page failed: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ FAQ page error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 5: Contacts page
Write-Host "5️⃣ Testing contacts page..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$DemoUrl/demo/contacts" -Method GET
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Contacts page loads successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Contacts page failed: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Contacts page error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 6: Demo FreeKassa API
Write-Host "6️⃣ Testing demo FreeKassa API..." -ForegroundColor Green
try {
    $body = @{
        email = "test@example.com"
        plan = "vip_lifetime"
        locale = "ru"
        honeypot = ""
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$DemoUrl/api/fk/demo-create" -Method POST -ContentType "application/json" -Body $body
    
    if ($response.url -and $response.order_id) {
        Write-Host "✅ Demo FreeKassa API works" -ForegroundColor Green
        Write-Host "   Order ID: $($response.order_id)" -ForegroundColor Gray
        Write-Host "   Demo mode: $($response.demo_mode)" -ForegroundColor Gray
    } else {
        Write-Host "❌ Demo FreeKassa API failed: $($response | ConvertTo-Json)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Demo FreeKassa API error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 7: Demo notify endpoint
Write-Host "7️⃣ Testing demo notify endpoint..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$DemoUrl/api/fk/demo-notify" -Method GET
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Demo notify endpoint accessible" -ForegroundColor Green
    } else {
        Write-Host "❌ Demo notify endpoint failed: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Demo notify endpoint error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 8: Check for demo indicators
Write-Host "8️⃣ Checking demo indicators..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$DemoUrl/demo" -Method GET
    $content = $response.Content
    
    if ($content -match "DEMO") {
        Write-Host "✅ Demo badge found" -ForegroundColor Green
    } else {
        Write-Host "❌ Demo badge not found" -ForegroundColor Red
    }
    
    if ($content -match "getlifeundo.com") {
        Write-Host "✅ Link to production site found" -ForegroundColor Green
    } else {
        Write-Host "❌ Link to production site not found" -ForegroundColor Red
    }
    
    if ($content -match "Демо-режим") {
        Write-Host "✅ Demo mode notice found" -ForegroundColor Green
    } else {
        Write-Host "❌ Demo mode notice not found" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Demo indicators check error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Demo smoke test completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Yellow
Write-Host "• Demo pages should load with 200 status" -ForegroundColor White
Write-Host "• Demo FreeKassa API should create test payments" -ForegroundColor White
Write-Host "• Demo indicators should be visible" -ForegroundColor White
Write-Host "• Links to production site should be present" -ForegroundColor White
