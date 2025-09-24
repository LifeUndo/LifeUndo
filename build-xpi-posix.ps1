# Build XPI with POSIX paths using .NET ZipFile
Add-Type -AssemblyName System.IO.Compression.FileSystem

$sourceDir = "extension_firefox"
$outputFile = "releases/0.2.3/LifeUndo-0.2.3-firefox.xpi"

Write-Host "Building XPI with POSIX paths..." -ForegroundColor Green

# Remove existing XPI
if (Test-Path $outputFile) {
    Remove-Item $outputFile
}

# Create output directory
$outputDir = Split-Path $outputFile -Parent
if (!(Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force
}

# Create ZIP with POSIX paths
$zip = [System.IO.Compression.ZipFile]::Open($outputFile, [System.IO.Compression.ZipArchiveMode]::Create)

try {
    Get-ChildItem -Path $sourceDir -Recurse -File | ForEach-Object {
        $relativePath = $_.FullName.Substring((Resolve-Path $sourceDir).Path.Length + 1)
        $posixPath = $relativePath -replace '\\', '/'
        
        Write-Host "Adding: $posixPath" -ForegroundColor Yellow
        $entry = $zip.CreateEntry($posixPath)
        $stream = $entry.Open()
        $fileBytes = [System.IO.File]::ReadAllBytes($_.FullName)
        $stream.Write($fileBytes, 0, $fileBytes.Length)
        $stream.Close()
    }
} finally {
    $zip.Dispose()
}

Write-Host "XPI created successfully: $outputFile" -ForegroundColor Green

# Verify contents
Write-Host "`nVerifying XPI contents:" -ForegroundColor Cyan
$verifyZip = [System.IO.Compression.ZipFile]::OpenRead($outputFile)
$verifyZip.Entries | ForEach-Object { Write-Host "  $($_.FullName)" -ForegroundColor White }
$verifyZip.Dispose()


















