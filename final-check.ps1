# Final infrastructure check

Write-Host "Final Infrastructure Check" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green

# Check getlifeundo.com
Write-Host "`nChecking getlifeundo.com..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "https://getlifeundo.com/" -Method Head -TimeoutSec 10 -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Server: $($response.Headers.Server)" -ForegroundColor Gray
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Check www.getlifeundo.com
Write-Host "`nChecking www.getlifeundo.com..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "https://www.getlifeundo.com/" -Method Head -TimeoutSec 10 -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Server: $($response.Headers.Server)" -ForegroundColor Gray
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Check new pages
Write-Host "`nChecking new pages..." -ForegroundColor Blue
$pages = @("/fund", "/gov", "/edu")
foreach ($page in $pages) {
    try {
        $response = Invoke-WebRequest -Uri "https://getlifeundo.com$page" -Method Head -TimeoutSec 10 -UseBasicParsing
        Write-Host "$page : $($response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "$page : Error" -ForegroundColor Yellow
    }
}

Write-Host "`nCheck complete!" -ForegroundColor Green


