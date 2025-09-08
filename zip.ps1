Add-Type -AssemblyName System.IO.Compression.FileSystem

$src1 = "C:\Users\Home\Downloads\LifeUndo\extension"
$dst1 = "C:\Users\Home\Downloads\LifeUndo\LifeUndo_Chrome.zip"
if (Test-Path $dst1) { Remove-Item $dst1 -Force }
[IO.Compression.ZipFile]::CreateFromDirectory($src1, $dst1)

$src2 = "C:\Users\Home\Downloads\LifeUndo\extension_firefox"
$dst2 = "C:\Users\Home\Downloads\LifeUndo\LifeUndo_Firefox.zip"
if (Test-Path $dst2) { Remove-Item $dst2 -Force }
[IO.Compression.ZipFile]::CreateFromDirectory($src2, $dst2)

Write-Host "Zipped Chrome and Firefox builds to:"
Write-Host $dst1
Write-Host $dst2

