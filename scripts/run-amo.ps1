param(
  [Parameter(Mandatory=$true)] [string]$Email,
  [Parameter(Mandatory=$true)] [string]$Password,
  [string]$Totp = "",
  [string]$EditUrl = "https://addons.mozilla.org/ru/developers/addon/lifeundo/edit",
  [ValidateSet("firefox","chromium")] [string]$Browser = "firefox",
  [bool]$Headless = $true,
  [ValidateSet("scrape","fill-dry","fill-save")] [string]$Action = "scrape"
)

$ErrorActionPreference = "Stop"

# Ensure Playwright deps installed (idempotent)
if (-not (Test-Path "node_modules/.bin/playwright")) {
  npm i -D playwright | Out-Host
}
if ($Browser -eq "firefox") {
  npx playwright install firefox | Out-Host
} else {
  npx playwright install chromium | Out-Host
}

$env:FX_EMAIL = $Email
$env:FX_PASSWORD = $Password
$env:FX_TOTP = $Totp
$env:AMO_EDIT_URL = $EditUrl
$env:AMO_BROWSER = $Browser
$env:HEADLESS = if ($Headless) { "true" } else { "false" }

switch ($Action) {
  "scrape" {
    node scripts/amo-scrape.mjs
  }
  "fill-dry" {
    $env:DRY_RUN = "true"
    node scripts/amo-fill.mjs
  }
  "fill-save" {
    $env:DRY_RUN = "false"
    node scripts/amo-fill.mjs
  }
}
