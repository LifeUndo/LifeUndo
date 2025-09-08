param(
  [int]$Width = 1280,
  [int]$Height = 800
)

function Get-BrowserPath {
  $candidates = @(
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  )
  foreach ($p in $candidates) { if (Test-Path $p) { return $p } }
  throw 'Chrome/Edge not found. Install Chrome or Edge to render screenshots.'
}

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$proj = Split-Path -Parent $root
$outDir = Join-Path $proj 'store/screenshots'
if (!(Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

function New-TemplateHtml([string]$name, [string]$title, [string]$bodyHtml) {
  $html = @"
<!doctype html>
<html>
  <head>
    <meta charset='utf-8' />
    <meta name='viewport' content='width=device-width, initial-scale=1' />
    <title>$title</title>
    <style>
      body { margin:0; font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; background:#0B0F16; color:#fff; }
      .wrap { width: ${Width}px; height: ${Height}px; display:flex; align-items:center; justify-content:center; }
      .panel { width: 900px; max-width: 95%; background:#0f141c; border:1px solid #1e2633; border-radius:16px; padding:24px; box-shadow:0 12px 30px rgba(0,0,0,.4) }
      h1 { margin:0 0 12px; font-size:32px; }
      .muted { color:#a8b3c1; }
      .btn { display:inline-block; padding:10px 14px; border-radius:8px; border:1px solid #3b4656; background:#101826; color:#fff; text-decoration:none; }
      .row { display:flex; gap:16px; align-items:center; }
      .tag { background:#12243d; color:#73a7ff; padding:4px 8px; border-radius:999px; font-size:12px; }
      .list { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:12px }
      .card { background:#0d121a; border:1px solid #1b2430; border-radius:10px; padding:12px; }
    </style>
  </head>
  <body>
    <div class='wrap'>
      <div class='panel'>
        $bodyHtml
      </div>
    </div>
  </body>
</html>
"@
  $path = Join-Path $outDir $name
  Set-Content -Path $path -Value $html -Encoding UTF8
  return $path
}

$logo = Join-Path $proj 'assets/logo.png'
$logoTag = if (Test-Path $logo) { "<img src='../assets/logo.png' alt='LifeUndo' style='width:64px;height:64px;border-radius:12px'/>" } else { "<div style='width:64px;height:64px;border-radius:12px;background:#73a7ff;display:flex;align-items:center;justify-content:center;font-weight:700'>LU</div>" }

$p1 = New-TemplateHtml 'promo.html' 'LifeUndo' "<div class='row'><div>$logoTag</div><h1>LifeUndo — Ctrl+Z для жизни</h1></div><div class='muted'>Восстанавливайте текст, открывайте закрытые вкладки и вставляйте из истории буфера обмена.</div><div style='margin-top:16px'><span class='tag'>Undo Last Action</span> <span class='tag'>Text History</span> <span class='tag'>Closed Tabs</span> <span class='tag'>Clipboard</span></div>"

$p2 = New-TemplateHtml 'features.html' 'Features' "<h1>Что умеет</h1><div class='list'><div class='card'>Текст — 20 состояний</div><div class='card'>Закрытые вкладки — 10</div><div class='card'>Буфер обмена — 10</div><div class='card'>Локальное хранение</div></div>"

$p3 = New-TemplateHtml 'privacy.html' 'Privacy' "<h1>Приватность</h1><div class='muted'>Все данные остаются локально в браузере. Нет сетевых запросов, нет аналитики.</div><div style='margin-top:12px'><a class='btn' href='../PRIVACY_POLICY.md'>Подробнее</a></div>"

$browser = Get-BrowserPath

function Shot($htmlPath, $pngPath) {
  $pngFull = Join-Path $outDir $pngPath
  $resolved = (Resolve-Path $htmlPath).Path
  $uriPath = $resolved -replace '\\','/'
  $url = "file:///$uriPath"
  $args = @(
    "--headless",
    "--disable-gpu",
    "--window-size=$Width,$Height",
    "--screenshot=$pngFull",
    $url
  )
  & $browser @args
}

Shot $p1 'promo_1280x800.png'
Shot $p2 'features_1280x800.png'
Shot $p3 'privacy_1280x800.png'

Write-Host ('Screenshots saved to: ' + $outDir)

