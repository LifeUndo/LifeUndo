param([string]$Base="https://getlifeundo-lkd7pohn0-alexs-projects-ef5d9b64.vercel.app")

$ErrorActionPreference = "Stop"
function Show($u){ "`n### $u"; }
function H($u){ (curl.exe -s -I $u) -join "`n" }

Show "$Base/"
H "$Base/"
Show "$Base/ru"
H "$Base/ru"
Show "$Base/ru/pricing"
H "$Base/ru/pricing"
Show "$Base/ru/download"
H "$Base/ru/download"
Show "$Base/ok"
H "$Base/ok"
Show "$Base/robots.txt"
H "$Base/robots.txt"
Show "$Base/sitemap.xml"
H "$Base/sitemap.xml"

"`nExpected:"
" - / → 307/308 → /ru"
" - /ru, /ru/pricing, /ru/download → 200"
" - /ok → 200 + no-store, no-cache, must-revalidate"
" - robots.txt/sitemap.xml → 200"
