#!/usr/bin/env bash
# green-check.sh — итоговая валидация 0.4.2 для .com и .ru

DOMAINS=("getlifeundo.com" "lifeundo.ru")
BEGET_IP="<BEGET_IP>"          # ← подставь реальный IP Beget
EXPECT_VER="0.4.2"
CURL="curl -sS --max-time 15"
RED=$'\e[31m'; GREEN=$'\e[32m'; YEL=$'\e[33m'; NC=$'\e[0m'

pass(){ echo "${GREEN}PASS${NC} $*"; }
fail(){ echo "${RED}FAIL${NC} $*"; EXIT=1; }
warn(){ echo "${YEL}WARN${NC}  $*"; }

check_domain(){
  local d="$1"
  echo "— — — ${d} — — —"

  # 1) DNS → A (должен указывать на Beget)
  A=$(dig @1.1.1.1 +short "$d" A | head -n1)
  [[ "$A" == "$BEGET_IP" ]] && pass "A $d = $A" || fail "A $d = ${A:-<none>} (ожидаем $BEGET_IP)"

  # 1.1) Нет левых AAAA
  AAAA=$(dig @1.1.1.1 +short "$d" AAAA | tr '\n' ' ')
  [[ -z "$AAAA" ]] && pass "AAAA $d отсутствуют" || warn "AAAA присутствуют: $AAAA (убрать/поправить при необходимости)"

  # 2) Заголовки (через Cloudflare, без Vercel)
  HDR=$($CURL -I -H "Cache-Control: no-cache" -L "https://$d/?cb=$(date +%s)" | tr -d '\r')
  echo "$HDR" | grep -iq '^server: cloudflare' && pass "Server: cloudflare" || fail "Server не cloudflare"
  echo "$HDR" | grep -iq '^cf-cache-status: \(DYNAMIC\|MISS\|BYPASS\)' && pass "cf-cache-status OK" || warn "cf-cache-status не MISS/DYNAMIC"
  echo "$HDR" | grep -iq '^x-vercel' && fail "Найден x-vercel-* (остались записи на Vercel?)" || pass "Нет x-vercel-*"

  # 3) /status → App version
  VER=$($CURL "https://$d/status" | grep -i "App version" || true)
  echo "$VER" | grep -q "$EXPECT_VER" && pass "/status = $EXPECT_VER" || fail "/status не $EXPECT_VER"

  # 4) pricing JSON доступен
  PJ=$($CURL "https://$d/api/public/pricing" | head -c 1 | tr -d '\n')
  [[ "$PJ" != "" ]] && pass "/api/public/pricing отвечает" || fail "/api/public/pricing не отвечает"
}

EXIT=0
for d in "${DOMAINS[@]}"; do check_domain "$d"; done

echo
[[ "$EXIT" == "0" ]] && echo "${GREEN}ALL GREEN — 0.4.2 принято ✅${NC}" || echo "${RED}Есть проблемы — см. FAIL выше ⛑️${NC}"
exit $EXIT

