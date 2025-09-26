# monitor-dns.ps1
# DNS monitoring script for getlifeundo.com

param(
    [int]$IntervalMinutes = 5,
    [int]$MaxChecks = 24
)

Write-Host "🔍 DNS Monitor for getlifeundo.com" -ForegroundColor Cyan
Write-Host "Expected IPs:" -ForegroundColor Yellow
Write-Host "  getlifeundo.com → 216.150.1.1" -ForegroundColor Green
Write-Host "  www.getlifeundo.com → c71265c384c0f7a5.vercel-dns-016.com" -ForegroundColor Green
Write-Host "Checking every $IntervalMinutes minutes, max $MaxChecks checks" -ForegroundColor Yellow
Write-Host ""

$checkCount = 0
$startTime = Get-Date

while ($checkCount -lt $MaxChecks) {
    $checkCount++
    $currentTime = Get-Date
    $elapsed = $currentTime - $startTime
    
    Write-Host "[$checkCount/$MaxChecks] $(Get-Date -Format 'HH:mm:ss') - Elapsed: $($elapsed.ToString('hh\:mm\:ss'))" -ForegroundColor Cyan
    
    # Check getlifeundo.com
    try {
        $result1 = nslookup getlifeundo.com 2>$null | Select-String "Addresses:"
        if ($result1) {
            $ip1 = ($result1.Line -split "Addresses:")[1].Trim()
            if ($ip1 -eq "216.150.1.1") {
                Write-Host "  ✅ getlifeundo.com → $ip1 (CORRECT)" -ForegroundColor Green
            } else {
                Write-Host "  ⏳ getlifeundo.com → $ip1 (waiting...)" -ForegroundColor Yellow
            }
        } else {
            Write-Host "  ❌ getlifeundo.com → No response" -ForegroundColor Red
        }
    } catch {
        Write-Host "  ❌ getlifeundo.com → Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Check www.getlifeundo.com
    try {
        $result2 = nslookup www.getlifeundo.com 2>$null | Select-String "Address:"
        if ($result2) {
            $ip2 = ($result2.Line -split "Address:")[1].Trim()
            if ($ip2 -like "*vercel-dns*" -or $ip2 -eq "216.150.1.1") {
                Write-Host "  ✅ www.getlifeundo.com → $ip2 (CORRECT)" -ForegroundColor Green
            } else {
                Write-Host "  ⏳ www.getlifeundo.com → $ip2 (waiting...)" -ForegroundColor Yellow
            }
        } else {
            Write-Host "  ❌ www.getlifeundo.com → No response" -ForegroundColor Red
        }
    } catch {
        Write-Host "  ❌ www.getlifeundo.com → Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Check if both are correct
    $bothCorrect = $false
    try {
        $check1 = nslookup getlifeundo.com 2>$null | Select-String "216.150.1.1"
        $check2 = nslookup www.getlifeundo.com 2>$null | Select-String "vercel-dns"
        $bothCorrect = $check1 -and $check2
    } catch {
        $bothCorrect = $false
    }
    
    if ($bothCorrect) {
        Write-Host ""
        Write-Host "🎉 SUCCESS! Both domains are pointing to correct IPs!" -ForegroundColor Green
        Write-Host "🌐 Testing website access..." -ForegroundColor Cyan
        
        try {
            $response = Invoke-WebRequest -Uri "https://getlifeundo.com" -Method HEAD -TimeoutSec 10 -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                Write-Host "✅ Website is accessible: https://getlifeundo.com (200 OK)" -ForegroundColor Green
            } else {
                Write-Host "⚠️ Website returned: $($response.StatusCode)" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "❌ Website not accessible yet: $($_.Exception.Message)" -ForegroundColor Red
        }
        
        break
    }
    
    if ($checkCount -lt $MaxChecks) {
        Write-Host "⏰ Waiting $IntervalMinutes minutes for next check..." -ForegroundColor Gray
        Start-Sleep -Seconds ($IntervalMinutes * 60)
    }
}

if ($checkCount -eq $MaxChecks) {
    Write-Host ""
    Write-Host "⏰ Max checks reached. DNS propagation may take longer." -ForegroundColor Yellow
    Write-Host "💡 You can run this script again or check manually:" -ForegroundColor Cyan
    Write-Host "   nslookup getlifeundo.com" -ForegroundColor Gray
    Write-Host "   nslookup www.getlifeundo.com" -ForegroundColor Gray
}

Write-Host ""
Write-Host "🏁 DNS monitoring completed." -ForegroundColor Cyan
