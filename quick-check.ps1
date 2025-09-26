# Quick infrastructure check

Write-Host "GLU Infra Status Check" -ForegroundColor Green
Write-Host "=====================" -ForegroundColor Green

# Check getlifeundo.com
Write-Host "`nChecking getlifeundo.com..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "https://getlifeundo.com/" -Method Head -TimeoutSec 10 -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Check lifeundo.ru  
Write-Host "`nChecking lifeundo.ru..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "https://lifeundo.ru/" -Method Head -TimeoutSec 10 -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Check DNS
Write-Host "`nChecking DNS..." -ForegroundColor Blue
try {
    $dns = nslookup getlifeundo.com 8.8.8.8
    Write-Host "DNS resolved" -ForegroundColor Green
} catch {
    Write-Host "DNS Error" -ForegroundColor Red
}

Write-Host "`nCheck complete!" -ForegroundColor Green

