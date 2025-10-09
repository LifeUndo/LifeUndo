param(
  [Parameter(Mandatory=$true)][string]$Url,        # например https://<preview>.vercel.app
  [Parameter(Mandatory=$true)][string]$Plan,       # pro_month | vip_lifetime | team_5 | starter_6m
  [string]$Email = "",
  [string]$Description = ""
)

Write-Host "== FK debug ==" -ForegroundColor Cyan
try {
  $d = Invoke-WebRequest -Uri "$Url/api/debug/fk" -UseBasicParsing
  $d.Content
} catch { Write-Host "[WARN] debug failed" -ForegroundColor Yellow }

$body = @{ plan = $Plan }
if ($Email) { $body.email = $Email }
if ($Description) { $body.description = $Description }

Write-Host "`n== Create ==" -ForegroundColor Cyan
try {
  $r = Invoke-WebRequest -Uri "$Url/api/payments/freekassa/create" `
      -Method Post -Body ($body | ConvertTo-Json) -ContentType "application/json" -UseBasicParsing
  $j = $r.Content | ConvertFrom-Json
  if ($j.pay_url) { "pay_url: $($j.pay_url)" } else { $r.Content }
} catch {
  $resp = $_.Exception.Response
  if ($resp) {
    $sr = New-Object System.IO.StreamReader($resp.GetResponseStream())
    $err = $sr.ReadToEnd()
    Write-Host $err -ForegroundColor Red
  } else {
    Write-Host "[ERR] no response body" -ForegroundColor Red
  }
}
