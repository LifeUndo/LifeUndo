param(
    [Parameter(Mandatory=$true)]
    [string]$VersionPath
)

Write-Host "Generating checksums.txt for $VersionPath" -ForegroundColor Green

if (-not (Test-Path $VersionPath)) {
    Write-Host "ERROR: Folder '$VersionPath' not found!" -ForegroundColor Red
    exit 1
}

$checksumsFile = Join-Path $VersionPath "checksums.txt"
$files = @()

$patterns = @("*.xpi", "*.exe", "*.dmg")
foreach ($pattern in $patterns) {
    $foundFiles = Get-ChildItem -Path $VersionPath -Filter $pattern
    $files += $foundFiles
}

if ($files.Count -eq 0) {
    Write-Host "ERROR: No files found for checksums!" -ForegroundColor Red
    exit 1
}

Write-Host "Found files: $($files.Count)" -ForegroundColor Cyan

$checksums = @()
foreach ($file in $files) {
    Write-Host "Processing: $($file.Name)" -ForegroundColor Yellow
    $hash = Get-FileHash -Path $file.FullName -Algorithm SHA256
    $checksums += "$($hash.Hash.ToLower())  $($file.Name)"
}

$checksums | Out-File -FilePath $checksumsFile -Encoding UTF8

Write-Host "checksums.txt created: $checksumsFile" -ForegroundColor Green
Write-Host "Content:" -ForegroundColor Cyan
Get-Content $checksumsFile | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
