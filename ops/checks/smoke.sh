#!/usr/bin/env bash
set -euo pipefail
BASE="${1:-https://getlifeundo-lkd7pohn0-alexs-projects-ef5d9b64.vercel.app}"

check () { echo -e "\n### $1"; curl -sI "$1"; }

check "$BASE/"
check "$BASE/ru"
check "$BASE/ru/pricing"
check "$BASE/ru/download"
check "$BASE/ok"
check "$BASE/robots.txt"
check "$BASE/sitemap.xml"

cat <<EOF

Expected:
 - / → 307/308 → /ru
 - /ru, /ru/pricing, /ru/download → 200
 - /ok → 200 + no-store, no-cache, must-revalidate
 - robots.txt/sitemap.xml → 200
EOF
