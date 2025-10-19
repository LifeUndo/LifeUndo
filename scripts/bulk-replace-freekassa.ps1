param(
    [string]$Root = (Resolve-Path "."),
    [string[]]$Include = @("*.md","*.markdown","*.mdx","*.txt","*.json","*.ts","*.tsx","*.js","*.mjs"),
    [string[]]$Dirs = @("docs","README.md","tests","public","PR_BODY.md","FINAL_*","WORK_REPORT_*","DEPLOYMENT_ARTIFACTS.md"),
    [switch]$WhatIf
)

Write-Host "🔄 Bulk replace FreeKassa domains in docs/tests..." -ForegroundColor Cyan
$patterns = @(
    @{ From = 'freekassa.com'; To = 'freekassa.net' },
    @{ From = 'freekassa.ru';  To = 'freekassa.net' }
)

$changed = @()
foreach ($dir in $Dirs) {
    $path = Join-Path $Root $dir
    if (Test-Path $path) {
        $files = Get-ChildItem -Path $path -Recurse -File -Include $Include -ErrorAction SilentlyContinue
        foreach ($file in $files) {
            $content = Get-Content -Raw -LiteralPath $file.FullName
            $original = $content
            foreach ($p in $patterns) {
                $content = $content -replace [Regex]::Escape($p.From), $p.To
            }
            if ($content -ne $original) {
                if ($WhatIf) {
                    Write-Host "Would update: $($file.FullName)" -ForegroundColor Yellow
                } else {
                    Set-Content -LiteralPath $file.FullName -Value $content -NoNewline
                    $changed += $file.FullName
                    Write-Host "Updated: $($file.FullName)" -ForegroundColor Green
                }
            }
        }
    }
}

Write-Host "Done. Changed files: $($changed.Count)" -ForegroundColor Cyan
if ($changed.Count -gt 0) { $changed | Sort-Object -Unique | ForEach-Object { Write-Host " - $_" } }
