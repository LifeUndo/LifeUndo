param(
  [Parameter(Mandatory=$true)][string]$ApiKey,
  [string]$BaseUrl = "https://getlifeundo-git-main-alexs-projects-ef5d9b64.vercel.app",
  [string[]]$Locales = @('ru','en'),
  [string[]]$Paths = @(
    '/',
    '/pricing','/features','/use-cases','/developers','/partners','/downloads','/support','/api','/fund','/whitelabel','/success',
    '/legal/offer','/legal/contract','/legal/dpa','/legal/sla',
    '/privacy'
  ),
  [int]$TimeoutSec = 20
)

$ErrorActionPreference = 'Stop'

function Get-PageReport {
  param(
    [string]$Url
  )
  try {
    $resp = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec $TimeoutSec
    $html = $resp.Content
    $status = $resp.StatusCode
  } catch {
    return @{ url = $Url; status = 'error'; error = $_.Exception.Message }
  }

  # very light-weight tag extracts (regex to avoid DOM deps)
  $title = [regex]::Match($html, '<title>(.*?)</title>', 'IgnoreCase').Groups[1].Value
  $desc  = [regex]::Match($html, '<meta[^>]*name=["'']description["''][^>]*content=["''](.*?)["'']', 'IgnoreCase').Groups[1].Value
  $ogt   = [regex]::Match($html, '<meta[^>]*property=["'']og:title["''][^>]*content=["''](.*?)["'']', 'IgnoreCase').Groups[1].Value
  $ogd   = [regex]::Match($html, '<meta[^>]*property=["'']og:description["''][^>]*content=["''](.*?)["'']', 'IgnoreCase').Groups[1].Value
  $canon = [regex]::Match($html, '<link[^>]*rel=["'']canonical["''][^>]*href=["''](.*?)["'']', 'IgnoreCase').Groups[1].Value
  $alts  = [regex]::Matches($html, '<link[^>]*rel=["'']alternate["''][^>]*hreflang=["''](.*?)["''][^>]*href=["''](.*?)["'']', 'IgnoreCase') | ForEach-Object { @{ hreflang=$_.Groups[1].Value; href=$_.Groups[2].Value } }

  return @{ url=$Url; status=$status; title=$title; description=$desc; og_title=$ogt; og_description=$ogd; canonical=$canon; alternates=$alts }
}

# Build URL list
$urls = @()
foreach ($loc in $Locales) {
  foreach ($p in $Paths) {
    if ($p.StartsWith('/')) {
      $suffix = $p
    } else {
      $suffix = '/' + $p
    }
    $u = ($BaseUrl.TrimEnd('/')) + '/' + $loc + $suffix
    $urls += $u
  }
}

Write-Host ("Will audit URLs: " + ($urls -join ', ')) -ForegroundColor Cyan

# Fetch reports
$reports = @()
foreach ($u in $urls) {
  Write-Host ("Fetching: " + $u)
  $reports += Get-PageReport -Url $u
}

# Compose GROK prompt
$prompt = @()
$prompt += "You are a senior web QA+SEO auditor. Provide an objective, actionable audit."
$prompt += "Inputs: a JSON array of page snapshots (status, title, meta, canonical, hreflang alternates)."
$prompt += "Tasks:"
$prompt += "1) Technical SEO: title/description length & relevance, canonical/hreflang correctness (RU/EN pairs), OG/Twitter completeness."
$prompt += "2) UX/i18n: RU/EN consistency of headings/CTAs; typography glitches; broken or missing pages."
$prompt += "3) Links: obvious 404/500; suspicious redirects (if any); cross-lang links."
$prompt += "4) Quick wins (1-3 days) and mid-term (2-4 weeks)."
$prompt += "Output strictly as Markdown with sections: Summary, Critical, High, Medium, Low, Quick Wins, Mid-Term, Per-Page Notes."
$promptText = ($prompt -join "\n")

$messages = @(
  @{ role = 'system'; content = 'You are a precise, strict web QA+SEO auditor.' },
  @{ role = 'user'; content = $promptText },
  @{ role = 'user'; content = (ConvertTo-Json $reports -Depth 6) }
)

$body = @{ model = 'grok-4-latest'; stream = $false; temperature = 0; messages = $messages } | ConvertTo-Json -Depth 6

$headers = @{ 'Content-Type'='application/json'; 'Authorization' = "Bearer $ApiKey" }

Write-Host "Querying GROK..." -ForegroundColor Yellow
try {
  $resp = Invoke-RestMethod -Method Post -Uri 'https://api.x.ai/v1/chat/completions' -Headers $headers -Body $body
} catch {
  Write-Error $_.Exception.Message
  exit 1
}

# Extract text (OpenAI-like schema)
$out = $resp.choices[0].message.content

# Save report
$ts = (Get-Date).ToString('yyyyMMdd_HHmmss')
$outDir = Join-Path $PSScriptRoot '..\reports'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
$outFile = Join-Path $outDir ("grok_audit_" + $ts + ".md")
$out | Out-File -FilePath $outFile -Encoding UTF8

Write-Host ("Report saved: " + (Resolve-Path $outFile)) -ForegroundColor Green
