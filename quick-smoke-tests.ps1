# quick-smoke-tests.ps1
# Quick smoke tests for getlifeundo.com

Write-Host "Quick Smoke Tests for getlifeundo.com" -ForegroundColor Cyan
Write-Host ""

$tests = @(
    @{ url = "https://getlifeundo.com"; name = "Home (redirect)"; expected = "200|307" },
    @{ url = "https://www.getlifeundo.com"; name = "Home (www)"; expected = "200" },
    @{ url = "https://www.getlifeundo.com/ok"; name = "Marker"; expected = "200" },
    @{ url = "https://www.getlifeundo.com/fund"; name = "Fund"; expected = "200" },
    @{ url = "https://www.getlifeundo.com/admin"; name = "Admin"; expected = "401" }
)

foreach ($test in $tests) {
    Write-Host "Testing $($test.name)..." -NoNewline -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri $test.url -Method HEAD -TimeoutSec 10 -ErrorAction Stop
        $statusCode = $response.StatusCode
        
        if ($test.expected -like "*$statusCode*") {
            Write-Host " OK $statusCode" -ForegroundColor Green
        } else {
            Write-Host " WARNING: $statusCode (expected: $($test.expected))" -ForegroundColor Yellow
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($test.expected -like "*$statusCode*") {
            Write-Host " OK $statusCode" -ForegroundColor Green
        } else {
            Write-Host " ERROR: $statusCode (expected: $($test.expected))" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "Smoke tests completed!" -ForegroundColor Cyan
