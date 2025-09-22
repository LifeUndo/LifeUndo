# LifeUndo v0.2.3 Build Script
# Creates release packages for Firefox and Chrome

Write-Host "Building LifeUndo v0.2.3..." -ForegroundColor Green

# Create temporary build directories
$firefoxBuild = "temp_firefox_build"
$chromeBuild = "temp_chrome_build"

# Clean up previous builds
if (Test-Path $firefoxBuild) { Remove-Item -Recurse -Force $firefoxBuild }
if (Test-Path $chromeBuild) { Remove-Item -Recurse -Force $chromeBuild }

# Copy Firefox files
Write-Host "Copying Firefox files..." -ForegroundColor Yellow
Copy-Item -Recurse "extension_firefox" $firefoxBuild

# Copy Chrome files
Write-Host "Copying Chrome files..." -ForegroundColor Yellow
Copy-Item -Recurse "extension" $chromeBuild

# Create Firefox XPI (as ZIP then rename)
Write-Host "Creating Firefox XPI..." -ForegroundColor Yellow
Set-Location $firefoxBuild
Compress-Archive -Path * -DestinationPath "../releases/0.2.3/LifeUndo-0.2.3-firefox.zip" -Force
Set-Location ..
# Rename ZIP to XPI
Rename-Item "releases/0.2.3/LifeUndo-0.2.3-firefox.zip" "releases/0.2.3/LifeUndo-0.2.3-firefox.xpi"

# Create Chrome ZIP
Write-Host "Creating Chrome ZIP..." -ForegroundColor Yellow
Set-Location $chromeBuild
Compress-Archive -Path * -DestinationPath "../releases/0.2.3/LifeUndo-0.2.3-chromium.zip" -Force
Set-Location ..

# Generate checksums
Write-Host "Generating checksums..." -ForegroundColor Yellow
$firefoxHash = Get-FileHash "releases/0.2.3/LifeUndo-0.2.3-firefox.xpi" -Algorithm SHA256
$chromeHash = Get-FileHash "releases/0.2.3/LifeUndo-0.2.3-chromium.zip" -Algorithm SHA256

$checksums = @"
LifeUndo-0.2.3-firefox.xpi: $($firefoxHash.Hash)
LifeUndo-0.2.3-chromium.zip: $($chromeHash.Hash)
"@

$checksums | Out-File -FilePath "releases/0.2.3/checksums.txt" -Encoding UTF8

# Clean up
Remove-Item -Recurse -Force $firefoxBuild
Remove-Item -Recurse -Force $chromeBuild

Write-Host "Build complete!" -ForegroundColor Green
Write-Host "Files created in releases/0.2.3/:" -ForegroundColor Cyan
Get-ChildItem "releases/0.2.3/" | ForEach-Object { Write-Host "  $($_.Name)" -ForegroundColor White }
