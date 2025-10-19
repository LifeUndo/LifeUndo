param(
  [Parameter(Mandatory=$true)][string]$BaseUrl,
  [string[]]$Paths = @(
    '/ru','/ru/downloads','/ru/features','/ru/pricing','/ru/use-cases','/ru/support','/ru/fund','/ru/fund/apply','/ru/privacy','/ru/terms','/ru/developers','/ru/partners',
    '/en','/en/downloads','/en/features','/en/pricing','/en/support','/en/privacy','/en/terms','/en/developers','/en/partners'
  ),
  [int]$TimeoutSec = 10
)

$ErrorActionPreference = 'Stop'

function Test-Url {
  param([string]$Url)
  try {
    $res = Invoke-WebRequest -Uri $Url -UseBasicParsing -MaximumRedirection 5 -TimeoutSec $TimeoutSec -Method Head -ErrorAction Stop
    return [PSCustomObject]@{ url=$Url; status=$res.StatusCode; ok=($res.StatusCode -ge 200 -and $res.StatusCode -lt 400) }
  } catch {
    return [PSCustomObject]@{ url=$Url; status='ERR'; ok=$false; error=$_.Exception.Message }
  }
}

$results = @()
foreach ($p in $Paths) {
  $u = ($BaseUrl.TrimEnd('/')) + $p
  $results += Test-Url -Url $u
}

$bad = $results | Where-Object { -not $_.ok }
$good = $results | Where-Object { $_.ok }

Write-Host ("OK: {0}, BAD: {1}" -f $good.Count, $bad.Count)
if ($bad.Count -gt 0) {
  Write-Host "Broken/Problem URLs:" -ForegroundColor Yellow
  $bad | ForEach-Object { Write-Host (" - {0} [{1}] {2}" -f $_.url, $_.status, $_.error) }
  exit 2
} else {
  Write-Host "All links responded with < 400" -ForegroundColor Green
}
