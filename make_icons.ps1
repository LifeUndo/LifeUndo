Add-Type -AssemblyName System.Drawing

function New-IconPng {
  param(
    [string]$Path,
    [int]$Size,
    [string]$Bg = '#0B5FFF',
    [string]$Fg = '#FFFFFF',
    [string]$Text = 'LU',
    [string]$LogoPath = ''
  )

  $bmp = New-Object System.Drawing.Bitmap($Size, $Size)
  $gfx = [System.Drawing.Graphics]::FromImage($bmp)
  $gfx.SmoothingMode = 'AntiAlias'
  $gfx.TextRenderingHint = 'ClearTypeGridFit'

  $bgc = [System.Drawing.ColorTranslator]::FromHtml($Bg)
  $fgc = [System.Drawing.ColorTranslator]::FromHtml($Fg)
  $brushBg = New-Object System.Drawing.SolidBrush($bgc)
  $brushFg = New-Object System.Drawing.SolidBrush($fgc)
  $gfx.FillRectangle($brushBg, 0, 0, $Size, $Size)

  if ($LogoPath -and (Test-Path $LogoPath)) {
    try {
      $logo = [System.Drawing.Image]::FromFile($LogoPath)
      # Fit logo into 70% of canvas
      $target = [Math]::Floor($Size * 0.7)
      $x = [Math]::Floor(($Size - $target) / 2)
      $y = [Math]::Floor(($Size - $target) / 2)
      $gfx.DrawImage($logo, $x, $y, $target, $target)
      $logo.Dispose()
    } catch {
      # fallback to text
      $fontSize = [Math]::Max([Math]::Floor($Size * 0.54), 8)
      $font = New-Object System.Drawing.Font('Segoe UI Semibold', $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
      $format = New-Object System.Drawing.StringFormat
      $format.Alignment = 'Center'
      $format.LineAlignment = 'Center'
      $rect = New-Object System.Drawing.RectangleF(0, 0, $Size, $Size)
      $gfx.DrawString($Text, $font, $brushFg, $rect, $format)
      $font.Dispose()
    }
  } else {
    $fontSize = [Math]::Max([Math]::Floor($Size * 0.54), 8)
    $font = New-Object System.Drawing.Font('Segoe UI Semibold', $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = 'Center'
    $format.LineAlignment = 'Center'
    $rect = New-Object System.Drawing.RectangleF(0, 0, $Size, $Size)
    $gfx.DrawString($Text, $font, $brushFg, $rect, $format)
    $font.Dispose()
  }

  $dir = Split-Path $Path -Parent
  if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }
  $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)

  $gfx.Dispose(); $bmp.Dispose(); $brushBg.Dispose(); $brushFg.Dispose();
}

$base = "C:\Users\Home\Downloads\LifeUndo"
$chrome = Join-Path $base 'extension'
$firefox = Join-Path $base 'extension_firefox'

$sizes = 16,32,48,128
$logoPath = Join-Path $base 'assets/logo.png'
foreach ($s in $sizes) {
  $outfile = Join-Path $base ("icons/icon$($s).png")
  New-IconPng -Path $outfile -Size $s -LogoPath $logoPath
}

# Copy to Chrome and Firefox folders
foreach ($s in $sizes) {
  Copy-Item (Join-Path $base ("icons/icon$($s).png")) (Join-Path $chrome ("icon$($s).png")) -Force
  Copy-Item (Join-Path $base ("icons/icon$($s).png")) (Join-Path $firefox ("icon$($s).png")) -Force
}

Write-Host 'Icons generated and copied.'

