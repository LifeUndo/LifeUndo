# Production verification script for lifeundo.ru
# Run AFTER fixing domain binding in Vercel

Write-Host "Production verification for lifeundo.ru" -ForegroundColor Green
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
Write-Host "=== MAIN URLS ===" -ForegroundColor Cyan

$results = @()

# Test root redirect
$results += Test-Url "https://lifeundo.ru/" "308" "Root redirect to /ru"

# Test main page
$results += Test-Url "https://lifeundo.ru/ru" "200" "Main page"

# Test pricing
$results += Test-Url "https://lifeundo.ru/ru/pricing" "200" "Pricing page"

# Test support
$results += Test-Url "https://lifeundo.ru/ru/support" "200" "Support page"

# Test use cases
$results += Test-Url "https://lifeundo.ru/ru/use-cases" "200" "Use cases page"

Write-Host ""
Write-Host "=== TECHNICAL URLS ===" -ForegroundColor Cyan

# Test /ok with headers
$results += Test-Url "https://lifeundo.ru/ok" "200" "Technical page /ok" @("Cache-Control", "Pragma")

# Test robots.txt
$results += Test-Content "https://lifeundo.ru/robots.txt" "lifeundo.ru" "robots.txt contains correct domain"

# Test sitemap.xml
$results += Test-Content "https://lifeundo.ru/sitemap.xml" "lifeundo.ru" "sitemap.xml contains correct domain"

Write-Host ""
Write-Host "=== FINAL RESULT ===" -ForegroundColor Cyan

$successCount = ($results | Where-Object { $_ -eq $true }).Count
$totalCount = $results.Count

Write-Host "Success: $successCount of $totalCount" -ForegroundColor $(if ($successCount -eq $totalCount) { "Green" } else { "Yellow" })

if ($successCount -eq $totalCount) {
    Write-Host "ALL TESTS PASSED!" -ForegroundColor Green
    Write-Host "Production is ready!" -ForegroundColor Green
} else {
    Write-Host "There are issues that need to be fixed" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "For detailed verification open browser and check:"
Write-Host "- https://lifeundo.ru/ru (main page)"
Write-Host "- https://lifeundo.ru/ru/pricing (pricing)"
Write-Host "- https://lifeundo.ru/ok (technical page)"
