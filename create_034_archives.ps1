Add-Type -AssemblyName System.IO.Compression.FileSystem

# Chrome/Chromium zip for 0.3.4
$src1 = "releases\0.3.4\LifeUndo-0.3.4-chromium"
$dst1 = "releases\0.3.4\LifeUndo-0.3.4-chromium.zip"
if (Test-Path $dst1) { Remove-Item $dst1 -Force }
[IO.Compression.ZipFile]::CreateFromDirectory($src1, $dst1)

# Firefox XPI for 0.3.4
$src2 = "releases\0.3.4\LifeUndo-0.3.4-firefox"
$dst2 = "releases\0.3.4\LifeUndo-0.3.4-firefox.xpi"
if (Test-Path $dst2) { Remove-Item $dst2 -Force }
[IO.Compression.ZipFile]::CreateFromDirectory($src2, $dst2)

Write-Host "Created release archives:"
Write-Host $dst1
Write-Host $dst2














