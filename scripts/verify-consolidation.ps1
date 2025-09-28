# Production verification script for getlifeundo.com consolidation
# Run AFTER setting up domains in Vercel

Write-Host "Production verification for getlifeundo.com consolidation" -ForegroundColor Green
Write-Host ""

# Function to test URL
function Test-Url {
    param(
        [string]$Url,
        [string]$ExpectedStatus,
        [string]$Description,
        [string[]]$RequiredHeaders = @()
    )
    
    Write-Host "Testing: $Description" -ForegroundColor Yellow
    Write-Host "URL: $Url" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method Head -UseBasicParsing -TimeoutSec 10
        $status = $response.StatusCode
        $headers = $response.Headers
        
        if ($status -eq $ExpectedStatus) {
            Write-Host "SUCCESS: $Description - OK ($status)" -ForegroundColor Green
            
            # Check headers
            foreach ($header in $RequiredHeaders) {
                if ($headers.ContainsKey($header)) {
                    Write-Host "  SUCCESS: $header : $($headers[$header])" -ForegroundColor Green
                } else {
                    Write-Host "  ERROR: Missing header: $header" -ForegroundColor Red
                }
            }
            
            return $true
        } else {
            Write-Host "ERROR: $Description - FAILED ($status, expected $ExpectedStatus)" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "ERROR: $Description - FAILED: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to test redirect
function Test-Redirect {
    param(
        [string]$Url,
        [string]$ExpectedStatus,
        [string]$ExpectedLocation,
        [string]$Description
    )
    
    Write-Host "Testing redirect: $Description" -ForegroundColor Yellow
    Write-Host "URL: $Url" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method Head -UseBasicParsing -TimeoutSec 10 -MaximumRedirection 0
        $status = $response.StatusCode
        $location = $response.Headers['Location']
        
        if ($status -eq $ExpectedStatus -and $location -like "*$ExpectedLocation*") {
            Write-Host "SUCCESS: $Description - OK ($status -> $location)" -ForegroundColor Green
            return $true
        } else {
            Write-Host "ERROR: $Description - FAILED ($status, expected $ExpectedStatus, location: $location)" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "ERROR: $Description - FAILED: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to test content
function Test-Content {
    param(
        [string]$Url,
        [string]$ExpectedContent,
        [string]$Description
    )
    
    Write-Host "Testing content: $Description" -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 10
        $content = $response.Content
        
        if ($content -like "*$ExpectedContent*") {
            Write-Host "SUCCESS: $Description - OK (contains '$ExpectedContent')" -ForegroundColor Green
            return $true
        } else {
            Write-Host "ERROR: $Description - FAILED (does not contain '$ExpectedContent')" -ForegroundColor Red
            Write-Host "Content: $($content.Substring(0, [Math]::Min(200, $content.Length)))..." -ForegroundColor Gray
            return $false
        }
    } catch {
        Write-Host "ERROR: $Description - FAILED: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Main tests
Write-Host "=== MAIN DOMAIN TESTS ===" -ForegroundColor Cyan

$results = @()

# Test main domain
$results += Test-Url "https://getlifeundo.com/" "308" "Root redirect to /ru"
$results += Test-Url "https://getlifeundo.com/ru" "200" "Main page"
$results += Test-Url "https://getlifeundo.com/ru/pricing" "200" "Pricing page"
$results += Test-Url "https://getlifeundo.com/ru/support" "200" "Support page"

Write-Host ""
Write-Host "=== REDIRECT TESTS (.ru -> .com) ===" -ForegroundColor Cyan

# Test redirects from .ru domains
$results += Test-Redirect "https://lifeundo.ru/" "301" "getlifeundo.com/ru" "lifeundo.ru -> getlifeundo.com"
$results += Test-Redirect "https://lifeundo.ru/pricing" "301" "getlifeundo.com/ru/pricing" "lifeundo.ru/pricing -> getlifeundo.com/ru/pricing"
$results += Test-Redirect "https://getlifeundo.ru/" "301" "getlifeundo.com/ru" "getlifeundo.ru -> getlifeundo.com"

Write-Host ""
Write-Host "=== TECHNICAL URLS ===" -ForegroundColor Cyan

# Test technical URLs
$results += Test-Url "https://getlifeundo.com/ok" "200" "Technical page /ok" @("Cache-Control", "Pragma")
$results += Test-Content "https://getlifeundo.com/robots.txt" "getlifeundo.com" "robots.txt contains correct domain"
$results += Test-Content "https://getlifeundo.com/sitemap.xml" "getlifeundo.com" "sitemap.xml contains correct domain"

Write-Host ""
Write-Host "=== PAYMENT URLS ===" -ForegroundColor Cyan

# Test payment URLs
$results += Test-Url "https://getlifeundo.com/ru/success" "200" "Payment success page"
$results += Test-Url "https://getlifeundo.com/ru/fail" "200" "Payment fail page"

Write-Host ""
Write-Host "=== FINAL RESULT ===" -ForegroundColor Cyan

$successCount = ($results | Where-Object { $_ -eq $true }).Count
$totalCount = $results.Count

Write-Host "Success: $successCount of $totalCount" -ForegroundColor $(if ($successCount -eq $totalCount) { "Green" } else { "Yellow" })

if ($successCount -eq $totalCount) {
    Write-Host "ALL TESTS PASSED!" -ForegroundColor Green
    Write-Host "Domain consolidation is successful!" -ForegroundColor Green
} else {
    Write-Host "There are issues that need to be fixed" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "For detailed verification open browser and check:"
Write-Host "- https://getlifeundo.com/ru (main page)"
Write-Host "- https://getlifeundo.com/ru/pricing (pricing)"
Write-Host "- https://lifeundo.ru/ (should redirect to getlifeundo.com)"
Write-Host "- https://getlifeundo.com/ok (technical page)"
