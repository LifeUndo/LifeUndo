# quick-dns-check.ps1
# Quick DNS status check

Write-Host "Quick DNS Check for getlifeundo.com" -ForegroundColor Cyan
Write-Host ""

# Check getlifeundo.com
Write-Host "Checking getlifeundo.com..." -ForegroundColor Yellow
try {
    $result1 = nslookup getlifeundo.com 2>$null
    $ip1 = ($result1 | Select-String "Addresses:").Line -split "Addresses:" | Select-Object -Last 1
    if ($ip1) {
        $ip1 = $ip1.Trim()
        Write-Host "  Current IP: $ip1" -ForegroundColor White
        if ($ip1 -eq "216.150.1.1") {
            Write-Host "  Status: CORRECT (Vercel IP)" -ForegroundColor Green
        } else {
            Write-Host "  Status: Waiting for update (expected: 216.150.1.1)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  Status: No response" -ForegroundColor Red
    }
} catch {
    Write-Host "  Status: Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Check www.getlifeundo.com
Write-Host "Checking www.getlifeundo.com..." -ForegroundColor Yellow
try {
    $result2 = nslookup www.getlifeundo.com 2>$null
    $ip2 = ($result2 | Select-String "Address:").Line -split "Address:" | Select-Object -Last 1
    if ($ip2) {
        $ip2 = $ip2.Trim()
        Write-Host "  Current IP: $ip2" -ForegroundColor White
        if ($ip2 -like "*vercel-dns*" -or $ip2 -eq "216.150.1.1") {
            Write-Host "  Status: CORRECT (Vercel DNS)" -ForegroundColor Green
        } else {
            Write-Host "  Status: Waiting for update (expected: vercel-dns)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  Status: No response" -ForegroundColor Red
    }
} catch {
    Write-Host "  Status: Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test website access
Write-Host "Testing website access..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://getlifeundo.com" -Method HEAD -TimeoutSec 10 -ErrorAction Stop
    Write-Host "  Status: Website accessible ($($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "  Status: Website not accessible: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "To monitor DNS changes, run: .\monitor-dns.ps1" -ForegroundColor Cyan