# post-fix-check.ps1
# Simple curl check 200/401

param(
    [Parameter(Mandatory=$true)]
    [string]$Url
)

Write-Host "Starting HTTP check for $Url" -ForegroundColor Cyan

$pages = @(
    @{ path = "/"; expected = 200; name = "Home" },
    @{ path = "/fund"; expected = 200; name = "Fund" },
    @{ path = "/ok"; expected = 200; name = "Marker" },
    @{ path = "/admin"; expected = 401; name = "Admin" }
)

foreach ($page in $pages) {
    $testUrl = "$Url$($page.path)"
    Write-Host "Checking $($page.name) ($testUrl)..." -NoNewline -ForegroundColor Green
    
    try {
        $response = Invoke-WebRequest -Uri $testUrl -Method HEAD -MaximumRedirection 0 -ErrorAction Stop
        if ($response.StatusCode -eq $page.expected) {
            Write-Host " OK $($response.StatusCode)" -ForegroundColor Green
        } else {
            Write-Host " ERROR: $($response.StatusCode) (expected $($page.expected))" -ForegroundColor Red
        }
    } catch {
        Write-Host " ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "HTTP check completed." -ForegroundColor Green