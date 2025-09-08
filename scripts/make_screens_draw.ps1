param(
  [int]$Width = 1280,
  [int]$Height = 800
)

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$proj = Split-Path -Parent $root
$outDir = Join-Path $proj 'store/screenshots'
if (!(Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

function Get-CenterXY {
  param([int]$Total,[int]$Size)
  return [int](($Total - $Size) / 2)
}

function New-Canvas {
  param([int]$W,[int]$H)
  $bmp = New-Object System.Drawing.Bitmap($W,$H)
  $gfx = [System.Drawing.Graphics]::FromImage($bmp)
  $gfx.SmoothingMode = 'AntiAlias'
  $gfx.TextRenderingHint = 'ClearTypeGridFit'
  return @($bmp,$gfx)
}

function Draw-RoundedRect {
  param($g,[System.Drawing.Rectangle]$rect,[int]$radius,[System.Drawing.Brush]$brush,[System.Drawing.Pen]$pen)
  $gp = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $radius * 2
  $gp.AddArc($rect.X, $rect.Y, $d, $d, 180, 90)
  $gp.AddArc($rect.Right - $d, $rect.Y, $d, $d, 270, 90)
  $gp.AddArc($rect.Right - $d, $rect.Bottom - $d, $d, $d, 0, 90)
  $gp.AddArc($rect.X, $rect.Bottom - $d, $d, $d, 90, 90)
  $gp.CloseFigure()
  if ($brush) { $g.FillPath($brush,$gp) }
  if ($pen) { $g.DrawPath($pen,$gp) }
  $gp.Dispose()
}

function Draw-Text {
  param($g,[string]$text,[System.Drawing.Font]$font,[System.Drawing.Brush]$brush,[System.Drawing.RectangleF]$rect)
  $sf = New-Object System.Drawing.StringFormat
  $sf.Alignment = 'Near'; $sf.LineAlignment = 'Near'
  $g.DrawString($text,$font,$brush,$rect,$sf)
  $sf.Dispose()
}

$bg = [System.Drawing.ColorTranslator]::FromHtml('#0B0F16')
$panelBg = [System.Drawing.ColorTranslator]::FromHtml('#0f141c')
$panelBorder = [System.Drawing.ColorTranslator]::FromHtml('#1e2633')
$muted = New-Object System.Drawing.SolidBrush(([System.Drawing.ColorTranslator]::FromHtml('#a8b3c1')))
$white = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$blue = New-Object System.Drawing.SolidBrush(([System.Drawing.ColorTranslator]::FromHtml('#73a7ff')))
$panelPen = New-Object System.Drawing.Pen(([System.Drawing.ColorTranslator]::FromHtml('#1e2633')),1)

$logoPath = Join-Path $proj 'assets/logo.png'
$logoImg = $null
if (Test-Path $logoPath) { $logoImg = [System.Drawing.Image]::FromFile($logoPath) }

function Save-Promo {
  $can = New-Canvas $Width $Height; $bmp=$can[0]; $g=$can[1]
  $g.Clear($bg)
  $px = Get-CenterXY -Total $Width -Size 900
  $py = Get-CenterXY -Total $Height -Size 520
  $panelRect = New-Object System.Drawing.Rectangle $px, $py, 900, 520
  Draw-RoundedRect $g $panelRect 16 (New-Object System.Drawing.SolidBrush($panelBg)) $panelPen
  if ($logoImg) { $g.DrawImage($logoImg, $panelRect.X+24, $panelRect.Y+24, 64, 64) }
  $titleFont = New-Object System.Drawing.Font('Segoe UI Semibold', 32, [System.Drawing.FontStyle]::Bold)
  $bodyFont = New-Object System.Drawing.Font('Segoe UI', 16)
  Draw-Text $g 'LifeUndo - Ctrl+Z for the web' $titleFont $white ([System.Drawing.RectangleF]::new($panelRect.X+100,$panelRect.Y+24,760,60))
  Draw-Text $g 'Restore text, reopen closed tabs, and paste from clipboard history.' $bodyFont $muted ([System.Drawing.RectangleF]::new($panelRect.X+24,$panelRect.Y+110,852,80))
  $tags = 'Undo Last Action','Text History','Closed Tabs','Clipboard History'
  $x = $panelRect.X+24; $y=$panelRect.Y+210
  $tagFont = New-Object System.Drawing.Font('Segoe UI', 12)
  foreach ($t in $tags) {
    $sz = $g.MeasureString($t,$tagFont)
    $tw = [int]$sz.Width + 24
    $th = [int]$sz.Height + 10
    $tagRect = New-Object System.Drawing.Rectangle $x, $y, $tw, $th
    Draw-RoundedRect $g $tagRect 999 (New-Object System.Drawing.SolidBrush(([System.Drawing.ColorTranslator]::FromHtml('#12243d')))) $null
    Draw-Text $g $t $tagFont $blue ([System.Drawing.RectangleF]::new($x+12,$y+5,$sz.Width,$sz.Height))
    $x += ([int]$sz.Width + 36)
  }
  $out = Join-Path $outDir 'promo_1280x800.png'
  $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose(); $titleFont.Dispose(); $bodyFont.Dispose(); $tagFont.Dispose()
}

function Save-Features {
  $can = New-Canvas $Width $Height; $bmp=$can[0]; $g=$can[1]
  $g.Clear($bg)
  $px = Get-CenterXY -Total $Width -Size 900
  $py = Get-CenterXY -Total $Height -Size 520
  $panelRect = New-Object System.Drawing.Rectangle $px, $py, 900, 520
  Draw-RoundedRect $g $panelRect 16 (New-Object System.Drawing.SolidBrush($panelBg)) $panelPen
  $titleFont = New-Object System.Drawing.Font('Segoe UI Semibold', 32, [System.Drawing.FontStyle]::Bold)
  $cardFont = New-Object System.Drawing.Font('Segoe UI', 16)
  Draw-Text $g 'Features' $titleFont $white ([System.Drawing.RectangleF]::new($panelRect.X+24,$panelRect.Y+24,852,60))
  $cards = 'Text - last 20 states','Closed tabs - last 10','Clipboard - last 10','Local-only storage'
  $cellW= [int]((900-24*3)/2); $cellH=100; $cx=$panelRect.X+24; $cy=$panelRect.Y+100
  foreach ($i in 0..3) {
    $r = New-Object System.Drawing.Rectangle ([int]$cx),([int]$cy),([int]$cellW),([int]$cellH)
    Draw-RoundedRect $g $r 10 (New-Object System.Drawing.SolidBrush(([System.Drawing.ColorTranslator]::FromHtml('#0d121a')))) (New-Object System.Drawing.Pen(([System.Drawing.ColorTranslator]::FromHtml('#1b2430')),1))
    Draw-Text $g $cards[$i] $cardFont $white ([System.Drawing.RectangleF]::new($r.X+12,$r.Y+12,$r.Width-24,$r.Height-24))
    if (($i % 2) -eq 0) { $cx += $cellW + 24 } else { $cx = $panelRect.X+24; $cy += ($cellH + 12) }
  }
  $out = Join-Path $outDir 'features_1280x800.png'
  $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose(); $titleFont.Dispose(); $cardFont.Dispose()
}

function Save-Privacy {
  $can = New-Canvas $Width $Height; $bmp=$can[0]; $g=$can[1]
  $g.Clear($bg)
  $px = Get-CenterXY -Total $Width -Size 900
  $py = Get-CenterXY -Total $Height -Size 360
  $panelRect = New-Object System.Drawing.Rectangle $px, $py, 900, 360
  Draw-RoundedRect $g $panelRect 16 (New-Object System.Drawing.SolidBrush($panelBg)) $panelPen
  $titleFont = New-Object System.Drawing.Font('Segoe UI Semibold', 32, [System.Drawing.FontStyle]::Bold)
  $bodyFont = New-Object System.Drawing.Font('Segoe UI', 16)
  Draw-Text $g 'Privacy' $titleFont $white ([System.Drawing.RectangleF]::new($panelRect.X+24,$panelRect.Y+24,852,60))
  Draw-Text $g 'All data stays local in your browser. No network requests, no analytics.' $bodyFont $muted ([System.Drawing.RectangleF]::new($panelRect.X+24,$panelRect.Y+100,852,80))
  $out = Join-Path $outDir 'privacy_1280x800.png'
  $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose(); $titleFont.Dispose(); $bodyFont.Dispose()
}

Save-Promo
Save-Features
Save-Privacy

if ($logoImg) { $logoImg.Dispose() }

Write-Host ('Screenshots drawn to: ' + $outDir)

