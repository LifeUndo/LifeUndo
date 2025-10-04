param(
  [string]$ProdUrl = "https://getlifeundo.com"
)

Write-Host "== Green check on $ProdUrl =="

function J($r){ try { return ($r.Content | ConvertFrom-Json) } catch { return $null } }

# 1) Health
$h = iwr "$ProdUrl/api/healthz" -UseBasicParsing -ErrorAction SilentlyContinue
if($h.StatusCode -ne 200){ throw "Healthz failed: $($h.StatusCode)" } else { Write-Host "Healthz: OK" }

# 2) FK debug
$fk = iwr "$ProdUrl/api/debug/fk" -UseBasicParsing -ErrorAction SilentlyContinue
$fkj = J $fk
if(-not $fkj -or -not $fkj.ok -or -not $fkj.merchantIdPresent){
  throw "FK debug failed or merchantId missing"
} else {
  Write-Host "FK debug: ok=$($fkj.ok) merchant=$($fkj.merchantIdMasked) url=$($fkj.paymentUrl)"
}

# 3) Pricing без 'Invalid plan'
$pz = (iwr "$ProdUrl/ru/pricing" -UseBasicParsing -ErrorAction SilentlyContinue).Content
if($pz -match "Invalid plan"){ throw "'Invalid plan' found on pricing" } else { Write-Host "Pricing: OK" }

# 4) Создание платежа
$body = @{ productId = "pro_month" } | ConvertTo-Json
$cr = iwr -Method POST -Uri "$ProdUrl/api/payments/freekassa/create" -ContentType "application/json" -Body $body -UseBasicParsing -ErrorAction SilentlyContinue
$cj = J $cr
if(-not $cj -or -not $cj.ok -or (-not $cj.pay_url)){ throw "Create payment failed" }
if($cj.pay_url -notmatch "pay\.freekassa\.(ru|com)"){ throw "Pay URL unexpected: $($cj.pay_url)" }
Write-Host "Create payment: OK ($($cj.pay_url))"

# 5) Негативный callback (ожидаем 400)
try {
  iwr -Method POST -Uri "$ProdUrl/api/payments/freekassa/callback" -Body @{ AMOUNT="149.00"; MERCHANT_ID="test"; MERCHANT_ORDER_ID="test"; SIGN="invalid" } -UseBasicParsing -ErrorAction Stop | Out-Null
  throw "Negative callback did not fail as expected"
} catch {
  if($_.Exception.Response.StatusCode.Value__ -eq 400){
    Write-Host "Negative callback: OK (400)"
  } else {
    throw "Negative callback unexpected: $($_.Exception.Message)"
  }
}

# 6) EN страницы доступны
$ens = @("/en","/en/features","/en/pricing","/en/downloads")
foreach($u in $ens){
  $r = iwr "$ProdUrl$u" -UseBasicParsing -ErrorAction SilentlyContinue
  if($r.StatusCode -ne 200){ throw "EN page $u failed: $($r.StatusCode)" }
}
Write-Host "EN pages: OK"

Write-Host "`nAll checks: PASSED ✅"
