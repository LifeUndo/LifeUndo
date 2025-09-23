Add-Type -AssemblyName System.IO.Compression.FileSystem

# Chrome/Chromium zip
$src1 = "C:\Users\Home\Downloads\LifeUndo\releases\0.3.4\LifeUndo-0.3.4-chromium"
$dst1 = "C:\Users\Home\Downloads\LifeUndo\releases\0.3.4\LifeUndo-0.3.4-chromium.zip"
if (Test-Path $dst1) { Remove-Item $dst1 -Force }
[IO.Compression.ZipFile]::CreateFromDirectory($src1, $dst1)

# Firefox XPI (same as zip)
$src2 = "C:\Users\Home\Downloads\LifeUndo\releases\0.3.4\LifeUndo-0.3.4-firefox"
$dst2 = "C:\Users\Home\Downloads\LifeUndo\releases\0.3.4\LifeUndo-0.3.4-firefox.xpi"
if (Test-Path $dst2) { Remove-Item $dst2 -Force }
[IO.Compression.ZipFile]::CreateFromDirectory($src2, $dst2)

Write-Host "Created release archives:"
Write-Host $dst1
Write-Host $dst2













