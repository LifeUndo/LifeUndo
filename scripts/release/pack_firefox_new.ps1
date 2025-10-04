param(
    [Parameter(Mandatory=$true)]
    [string]$Version
)

Write-Host "Packing Firefox extension version $Version" -ForegroundColor Green

$extensionPath = "extension"
$outputDir = "public/app/$Version"
$xpiName = "lifeundo-$Version.xpi"

if (-not (Test-Path $extensionPath)) {
    Write-Host "ERROR: Extension folder '$extensionPath' not found!" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

$zipPath = Join-Path $outputDir $xpiName
Write-Host "Creating XPI: $zipPath" -ForegroundColor Cyan

if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($extensionPath, $zipPath)

if (Test-Path $zipPath) {
    $fileSize = (Get-Item $zipPath).Length
    Write-Host "XPI created: $xpiName ($([math]::Round($fileSize/1KB, 2)) KB)" -ForegroundColor Green
} else {
    Write-Host "Error creating XPI!" -ForegroundColor Red
    exit 1
}

Write-Host "Done! XPI saved to: $zipPath" -ForegroundColor Green
