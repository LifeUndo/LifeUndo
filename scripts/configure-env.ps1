param(
  [Parameter(Mandatory=$true)][string]$VercelProject,
  [Parameter(Mandatory=$true)][string]$MerchantId,
  [Parameter(Mandatory=$true)][string]$Secret1,
  [Parameter(Mandatory=$true)][string]$Secret2,
  [Parameter(Mandatory=$true)][string]$SiteUrl,
  [Parameter()][switch]$EnableFk = $true,
  [Parameter()][string]$AmoIssuer,
  [Parameter()][string]$AmoSecret,
  [Parameter()][ValidateSet('production','preview','development')][string]$VercelEnv='production'
)

$ErrorActionPreference = 'Stop'

Write-Host "⚙️ Configuring Vercel env for project: $VercelProject ($VercelEnv)" -ForegroundColor Cyan

# Verify CLI availability
function Assert-Cli {
  param([string]$Name)
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Required CLI not found: $Name"
  }
}
Assert-Cli vercel
Assert-Cli gh

# Set Vercel envs
$envs = @(
  @{ key='FREEKASSA_MERCHANT_ID'; value=$MerchantId },
  @{ key='FREEKASSA_SECRET1'; value=$Secret1 },
  @{ key='FREEKASSA_SECRET2'; value=$Secret2 },
  @{ key='FREEKASSA_PAYMENT_URL'; value='https://pay.freekassa.net/' },
  @{ key='NEXT_PUBLIC_FK_ENABLED'; value=($EnableFk.IsPresent -or $EnableFk) ? 'true' : 'false' },
  @{ key='NEXT_PUBLIC_SITE_URL'; value=$SiteUrl }
)

foreach ($e in $envs) {
  $temp = New-TemporaryFile
  try {
    Set-Content -Path $temp -Value $e.value -NoNewline
    vercel env add $e.key $VercelEnv --project $VercelProject < $temp | Out-Null
    Write-Host "Set $($e.key) for $VercelEnv" -ForegroundColor Green
  } finally { Remove-Item $temp -ErrorAction SilentlyContinue }
}

# GitHub secrets (optional AMO)
if ($AmoIssuer -and $AmoSecret) {
  gh secret set AMO_JWT_ISSUER -b"$AmoIssuer" | Out-Null
  gh secret set AMO_JWT_SECRET -b"$AmoSecret" | Out-Null
  Write-Host "Set GitHub secrets: AMO_JWT_ISSUER, AMO_JWT_SECRET" -ForegroundColor Green
}

Write-Host "✅ Done. Trigger a redeploy in Vercel to apply changes." -ForegroundColor Cyan
