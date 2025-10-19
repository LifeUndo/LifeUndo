param(
  [Parameter(Mandatory=$true)][string]$PreviewUrl
)

$ErrorActionPreference = 'Stop'

Write-Host "FreeKassa Smoke Test" -ForegroundColor Cyan
Write-Host ("Preview URL: {0}" -f $PreviewUrl) -ForegroundColor Yellow

# Test 1: Debug API
Write-Host "[1] /api/debug/fk" -ForegroundColor Cyan
try {
  $debugResponse = Invoke-RestMethod -Uri ("{0}/api/debug/fk" -f $PreviewUrl) -UseBasicParsing
  if ($debugResponse.ok -and $debugResponse.fkEnabled) {
    Write-Host "OK debug fk" -ForegroundColor Green
  } else {
    Write-Host "WARN: debug fk not ok or disabled" -ForegroundColor Yellow
  }
} catch {
  $resp = $_.Exception.Response
  if ($resp -and $resp.StatusCode -eq 404) {
    Write-Host "OK: debug fk is disabled in production (404)" -ForegroundColor Green
  } else {
    Write-Host ("FAIL: debug fk error: {0}" -f $_.Exception.Message) -ForegroundColor Red
    exit 1
  }
}

# Test 2: Create Payment (Pro via plan)
Write-Host "[2] create payment pro (plan=pro_month)" -ForegroundColor Cyan
try {
  $paymentBody = @{ plan = "pro_month"; email = "test@example.com" } | ConvertTo-Json
  $paymentResponse = Invoke-RestMethod -Method Post -Uri ("{0}/api/payments/freekassa/create" -f $PreviewUrl) -Body $paymentBody -ContentType "application/json"
  if (-not $paymentResponse.ok) { throw "ok=false" }
  if (-not $paymentResponse.pay_url) { throw "no pay_url" }
  if ($paymentResponse.pay_url -notmatch 'https://pay\.freekassa\.net/') { Write-Host ("PAY_URL= {0}" -f $paymentResponse.pay_url) -ForegroundColor Yellow; throw "wrong domain" }
  if ($paymentResponse.pay_url -notmatch 'oa=599\.00') { Write-Host ("PAY_URL= {0}" -f $paymentResponse.pay_url) -ForegroundColor Yellow; throw "wrong amount" }
  if ($paymentResponse.pay_url -notmatch 'currency=RUB') { throw "wrong currency" }
  Write-Host "OK create pro" -ForegroundColor Green
} catch {
  Write-Host ("FAIL: create pro: {0}" -f $_.Exception.Message) -ForegroundColor Red
  exit 1
}

# Test 3: Create Payment (VIP via plan)
Write-Host "[3] create payment vip (plan=vip_lifetime)" -ForegroundColor Cyan
try {
  $paymentBody2 = @{ plan = "vip_lifetime" } | ConvertTo-Json
  $paymentResponse2 = Invoke-RestMethod -Method Post -Uri ("{0}/api/payments/freekassa/create" -f $PreviewUrl) -Body $paymentBody2 -ContentType "application/json"
  if (-not $paymentResponse2.ok) { throw "ok=false" }
  if ($paymentResponse2.pay_url -notmatch 'oa=9990\.00') { Write-Host ("PAY_URL= {0}" -f $paymentResponse2.pay_url) -ForegroundColor Yellow; throw "wrong amount" }
  Write-Host "OK create vip" -ForegroundColor Green
} catch {
  Write-Host ("FAIL: create vip: {0}" -f $_.Exception.Message) -ForegroundColor Red
}

# Test 4: Invalid product should fail
Write-Host "[4] invalid product" -ForegroundColor Cyan
try {
  $badBody = @{ productId = "invalid_product" } | ConvertTo-Json
  try {
    $null = Invoke-RestMethod -Method Post -Uri ("{0}/api/payments/freekassa/create" -f $PreviewUrl) -Body $badBody -ContentType "application/json"
    Write-Host "FAIL: invalid product did not fail" -ForegroundColor Red
  } catch {
    $resp = $_.Exception.Response
    if ($resp.StatusCode -eq 400) { Write-Host "OK invalid product 400" -ForegroundColor Green } else { Write-Host ("WARN: invalid product code {0}" -f $resp.StatusCode) -ForegroundColor Yellow }
  }
} catch {
  Write-Host ("WARN: invalid product test error: {0}" -f $_.Exception.Message) -ForegroundColor Yellow
}

# Test 5: Pricing page
Write-Host "[5] pricing page" -ForegroundColor Cyan
try {
  $pricing = Invoke-WebRequest -Uri ("{0}/ru/pricing" -f $PreviewUrl) -UseBasicParsing
  if ($pricing.StatusCode -eq 200) { Write-Host "OK pricing 200" -ForegroundColor Green } else { Write-Host ("WARN pricing {0}" -f $pricing.StatusCode) -ForegroundColor Yellow }
} catch {
  Write-Host ("WARN: pricing page error: {0}" -f $_.Exception.Message) -ForegroundColor Yellow
}

Write-Host "DONE FreeKassa smoke" -ForegroundColor Cyan
