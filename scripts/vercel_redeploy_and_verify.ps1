param(
  [string]$PreviewUrl = "https://getlifeundo-git-main-alexs-projects-ef5d9b64.vercel.app"
)

Write-Host "[Info] Preview URL: $PreviewUrl"

# Ensure Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "[ERROR] Node.js is required. Install from https://nodejs.org/" -ForegroundColor Red
  exit 1
}

# Ensure Vercel CLI
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
  Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
  & npm.cmd install -g vercel@latest
  if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to install vercel CLI" -ForegroundColor Red
    exit 1
  }
}

# Login flow (opens browser)
Write-Host "Starting Vercel login (browser)..." -ForegroundColor Cyan
vercel login

Write-Host "Vercel whoami:" -ForegroundColor Cyan
vercel whoami

# Warmup
try {
  Invoke-WebRequest "$PreviewUrl/en/pricing" -UseBasicParsing | Out-Null
  Invoke-WebRequest "$PreviewUrl/ru/pricing" -UseBasicParsing | Out-Null
} catch {}

Start-Sleep -Seconds 25

# Verify EN heading
try {
  $content = (Invoke-WebRequest "$PreviewUrl/en/pricing" -UseBasicParsing).Content
  if ($content -match "Pricing") {
    Write-Host "[OK] EN heading found" -ForegroundColor Green
  } else {
    Write-Host "[FAIL] EN heading not found" -ForegroundColor Red
  }
} catch {
  Write-Host "[FAIL] EN pricing request error: $_" -ForegroundColor Red
}

# Verify FK create
try {
  $body = @{ plan = "starter_6m"; email = "test@example.com" } | ConvertTo-Json
  $r = Invoke-RestMethod -Method Post -Uri "$PreviewUrl/api/payments/freekassa/create" -Body $body -ContentType "application/json"
  $json = $r | ConvertTo-Json -Depth 5
  Write-Host "Response: $json"
  if ($r.pay_url -and ($r.pay_url -match "pay\.freekassa\.net")) {
    Write-Host "[OK] pay_url on .net" -ForegroundColor Green
  } else {
    Write-Host "[FAIL] pay_url missing or wrong domain" -ForegroundColor Red
  }
  if ($r.orderId -match "^(PROM|VIPL|TEAM5|S6M)-") {
    Write-Host "[OK] orderId has prefix" -ForegroundColor Green
  } else {
    Write-Host "[WARN] orderId without prefix (likely old build)" -ForegroundColor Yellow
  }

  # Summary soft check
  try {
    $s = Invoke-RestMethod -Method Get -Uri "$PreviewUrl/api/payment/summary?order_id=$($r.orderId)"
    if ($s.ok -eq $true) { Write-Host "[OK] Summary soft ok" -ForegroundColor Green }
    else { Write-Host "[WARN] Summary response: $(($s | ConvertTo-Json -Depth 5))" -ForegroundColor Yellow }
  } catch {
    Write-Host "[WARN] Summary error (maybe still building): $_" -ForegroundColor Yellow
  }
} catch {
  Write-Host "[FAIL] FK create error: $_" -ForegroundColor Red
}
