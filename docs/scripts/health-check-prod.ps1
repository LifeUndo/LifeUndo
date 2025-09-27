# PROD Health Check Script
# Comprehensive check for getlifeundo.com production

param(
    [Parameter(Mandatory=$false)]
    [string]$BaseUrl = "https://getlifeundo.com"
)

Write-Host "🏥 LifeUndo PROD Health Check" -ForegroundColor Cyan
Write-Host "🔗 Base URL: $BaseUrl" -ForegroundColor Yellow
Write-Host ""

# Test 1: DNS Resolution
Write-Host "1️⃣ Testing DNS resolution..." -ForegroundColor Green
try {
    $dnsResult = nslookup getlifeundo.com 2>$null
    if ($dnsResult -match "76\.76\.21\.21") {
        Write-Host "✅ DNS points to Vercel (76.76.21.21)" -ForegroundColor Green
    } elseif ($dnsResult -match "45\.130\.41\.28") {
        Write-Host "❌ DNS still points to old hosting (45.130.41.28)" -ForegroundColor Red
        Write-Host "   Need to update DNS records in Cloudflare" -ForegroundColor Yellow
    } else {
        Write-Host "⚠️ DNS resolution unclear" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ DNS check failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 2: SSL Certificate
Write-Host "2️⃣ Testing SSL certificate..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/" -Method GET -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ SSL certificate valid" -ForegroundColor Green
        Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Gray
    } else {
        Write-Host "❌ SSL certificate invalid: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ SSL check failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 3: Main page
Write-Host "3️⃣ Testing main page..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/" -Method GET -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Main page loads successfully" -ForegroundColor Green
        if ($response.Content -match "LifeUndo") {
            Write-Host "✅ Content contains LifeUndo branding" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Content may not be correct" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Main page failed: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Main page error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 4: Health endpoint
Write-Host "4️⃣ Testing health endpoint..." -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/api/_health" -Method GET
    Write-Host "✅ Health endpoint accessible" -ForegroundColor Green
    
    if ($response.status -eq "ok") {
        Write-Host "✅ Overall health: OK" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Overall health: $($response.status)" -ForegroundColor Yellow
    }
    
    # Check individual services
    if ($response.services) {
        foreach ($service in $response.services.PSObject.Properties) {
            $status = $service.Value.status
            $name = $service.Name
            if ($status -eq "ok") {
                Write-Host "   ✅ $name: OK" -ForegroundColor Green
            } else {
                Write-Host "   ❌ $name: $status" -ForegroundColor Red
            }
        }
    }
} catch {
    Write-Host "❌ Health endpoint error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 5: Database connection
Write-Host "5️⃣ Testing database connection..." -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/api/_health/db" -Method GET
    if ($response.status -eq "ok") {
        Write-Host "✅ Database connection OK" -ForegroundColor Green
    } else {
        Write-Host "❌ Database connection failed: $($response.status)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Database check error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 6: Billing API
Write-Host "6️⃣ Testing billing API..." -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/api/billing/plans" -Method GET
    if ($response.plans) {
        Write-Host "✅ Billing API accessible" -ForegroundColor Green
        Write-Host "   Plans available: $($response.plans.Count)" -ForegroundColor Gray
    } else {
        Write-Host "⚠️ Billing API response unexpected" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Billing API error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 7: FreeKassa integration
Write-Host "7️⃣ Testing FreeKassa integration..." -ForegroundColor Green
try {
    $body = @{
        email = "test@example.com"
        plan = "vip_lifetime"
        locale = "ru"
        honeypot = ""
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$BaseUrl/api/fk/create" -Method POST -ContentType "application/json" -Body $body
    
    if ($response.url -and $response.order_id) {
        Write-Host "✅ FreeKassa integration works" -ForegroundColor Green
        Write-Host "   Order ID: $($response.order_id)" -ForegroundColor Gray
    } else {
        Write-Host "❌ FreeKassa integration failed" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ FreeKassa test error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 8: Admin panel (if accessible)
Write-Host "8️⃣ Testing admin panel..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/admin" -Method GET -UseBasicParsing
    if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 401) {
        Write-Host "✅ Admin panel accessible" -ForegroundColor Green
        if ($response.StatusCode -eq 401) {
            Write-Host "   (Authentication required - expected)" -ForegroundColor Gray
        }
    } else {
        Write-Host "❌ Admin panel failed: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Admin panel error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 9: WWW subdomain
Write-Host "9️⃣ Testing www subdomain..." -ForegroundColor Green
try {
    $wwwUrl = $BaseUrl -replace "getlifeundo\.com", "www.getlifeundo.com"
    $response = Invoke-WebRequest -Uri $wwwUrl -Method GET -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ WWW subdomain works" -ForegroundColor Green
    } else {
        Write-Host "❌ WWW subdomain failed: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ WWW subdomain error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 PROD health check completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Yellow
Write-Host "• DNS should point to 76.76.21.21 (Vercel)" -ForegroundColor White
Write-Host "• SSL certificate should be valid" -ForegroundColor White
Write-Host "• All API endpoints should respond correctly" -ForegroundColor White
Write-Host "• Database should be connected" -ForegroundColor White
Write-Host "• FreeKassa should work with PROD keys" -ForegroundColor White
