param(
  [ValidateSet('start','stop','status')][string]$Action = 'status',
  [string]$Task = '',
  [string]$Note = ''
)

$ErrorActionPreference = 'Stop'
$LogDir = Join-Path $PSScriptRoot '..' 'logs'
$LogPath = Join-Path $LogDir 'time-log.csv'

if (-not (Test-Path $LogDir)) { New-Item -ItemType Directory -Path $LogDir | Out-Null }
if (-not (Test-Path $LogPath)) {
  "started_at_msk,stopped_at_msk,task,note,duration_min" | Set-Content -Path $LogPath -Encoding UTF8
}

function Get-MoscowNow {
  $msk = [System.TimeZoneInfo]::FindSystemTimeZoneById('Russian Standard Time')
  $utcNow = [DateTime]::UtcNow
  return [System.TimeZoneInfo]::ConvertTimeFromUtc($utcNow, $msk)
}

function Get-OpenEntry {
  $lines = Get-Content -Path $LogPath -Encoding UTF8
  if ($lines.Count -le 1) { return $null }
  $last = $lines[-1]
  $cols = $last -split ','
  if ($cols.Length -ge 5 -and [string]::IsNullOrWhiteSpace($cols[1])) { return $last }
  return $null
}

switch ($Action) {
  'start' {
    if ([string]::IsNullOrWhiteSpace($Task)) { throw 'Specify -Task for start' }
    $open = Get-OpenEntry
    if ($open) { Write-Host 'An entry is already open. Use -Action stop first.' -ForegroundColor Yellow; exit 0 }
    $start = (Get-MoscowNow).ToString('yyyy-MM-dd HH:mm:ss')
    $line = "$start,," + ($Task -replace ',', ';') + "," + ($Note -replace ',', ';') + ","
    Add-Content -Path $LogPath -Value $line -Encoding UTF8
    Write-Host "Started: $Task @ $start (MSK)" -ForegroundColor Green
  }
  'stop' {
    $lines = Get-Content -Path $LogPath -Encoding UTF8
    $open = Get-OpenEntry
    if (-not $open) { Write-Host 'No open entry to stop.' -ForegroundColor Yellow; exit 0 }
    $stopped = (Get-MoscowNow).ToString('yyyy-MM-dd HH:mm:ss')
    $idx = $lines.Count - 1
    $cols = $lines[$idx] -split ','
    $startedAt = [DateTime]::ParseExact($cols[0], 'yyyy-MM-dd HH:mm:ss', $null)
    $stoppedAt = [DateTime]::ParseExact($stopped, 'yyyy-MM-dd HH:mm:ss', $null)
    $duration = [math]::Round(($stoppedAt - $startedAt).TotalMinutes, 1)
    $cols[1] = $stopped
    $cols[4] = "$duration"
    $lines[$idx] = ($cols -join ',')
    Set-Content -Path $LogPath -Value $lines -Encoding UTF8
    Write-Host "Stopped @ $stopped (MSK), duration: $duration min" -ForegroundColor Cyan
  }
  'status' {
    $open = Get-OpenEntry
    if ($open) {
      $cols = $open -split ','
      Write-Host ("Open: task='{0}', started_at_msk={1}" -f $cols[2], $cols[0]) -ForegroundColor Yellow
    } else {
      Write-Host 'No open entry.' -ForegroundColor Gray
    }
  }
}
