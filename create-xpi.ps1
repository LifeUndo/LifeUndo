# Create Firefox .xpi file for LifeUndo v0.2.1
Add-Type -AssemblyName System.IO.Compression.FileSystem

$src = "C:\Users\Home\Downloads\LifeUndo\extension_firefox"
$dst = "C:\Users\Home\Downloads\LifeUndo\LifeUndo_Firefox_v0.2.1.xpi"

if (Test-Path $dst) { 
    Remove-Item $dst -Force 
    Write-Host "Removed existing $dst"
}

[IO.Compression.ZipFile]::CreateFromDirectory($src, $dst)

Write-Host "Created Firefox .xpi file: $dst"
Write-Host "File size: $((Get-Item $dst).Length) bytes"
























