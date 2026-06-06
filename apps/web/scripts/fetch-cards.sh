#!/usr/bin/env bash
#
# Download the public-domain Rider-Waite-Smith deck (Pamela Colman Smith, 1909)
# from Wikimedia Commons into apps/web/public/cards/, named to match the seed paths.
#
# Re-runnable. Reports any files that fail to download so names can be fixed.
#
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT="$SCRIPT_DIR/../public/cards"
UA="tarot-ai-card-fetch/1.0 (educational; contact: dev)"
BASE="https://commons.wikimedia.org/wiki/Special:FilePath"

mkdir -p "$OUT/major"
fails=0
ok=0

fetch() {
  local src="$1" dest="$2"
  # Skip files already downloaded (re-runnable, avoids re-hitting the rate limit)
  if [ -f "$dest" ] && [ "$(stat -f%z "$dest" 2>/dev/null || echo 0)" -gt 3000 ]; then
    ok=$((ok + 1))
    return
  fi
  local url="$BASE/$src"
  local code
  code=$(curl -sL -A "$UA" --max-time 90 \
    --retry 3 --retry-delay 8 --retry-all-errors \
    -w "%{http_code}" -o "$dest" "$url")
  # Valid if HTTP 200 and the file is a real image (> 3 KB)
  if [ "$code" = "200" ] && [ "$(stat -f%z "$dest" 2>/dev/null || echo 0)" -gt 3000 ]; then
    ok=$((ok + 1))
  else
    echo "  FAIL ($code): $src -> $dest"
    rm -f "$dest"
    fails=$((fails + 1))
  fi
  sleep 0.5 # be gentle with Wikimedia's rate limit
}

echo "Downloading Major Arcana..."
# number:WikimediaFile:slug
majors=(
  "00:RWS_Tarot_00_Fool.jpg:the-fool"
  "01:RWS_Tarot_01_Magician.jpg:the-magician"
  "02:RWS_Tarot_02_High_Priestess.jpg:the-high-priestess"
  "03:RWS_Tarot_03_Empress.jpg:the-empress"
  "04:RWS_Tarot_04_Emperor.jpg:the-emperor"
  "05:RWS_Tarot_05_Hierophant.jpg:the-hierophant"
  "06:RWS_Tarot_06_Lovers.jpg:the-lovers"
  "07:RWS_Tarot_07_Chariot.jpg:the-chariot"
  "08:RWS_Tarot_08_Strength.jpg:strength"
  "09:RWS_Tarot_09_Hermit.jpg:the-hermit"
  "10:RWS_Tarot_10_Wheel_of_Fortune.jpg:wheel-of-fortune"
  "11:RWS_Tarot_11_Justice.jpg:justice"
  "12:RWS_Tarot_12_Hanged_Man.jpg:the-hanged-man"
  "13:RWS_Tarot_13_Death.jpg:death"
  "14:RWS_Tarot_14_Temperance.jpg:temperance"
  "15:RWS_Tarot_15_Devil.jpg:the-devil"
  "16:RWS_Tarot_16_Tower.jpg:the-tower"
  "17:RWS_Tarot_17_Star.jpg:the-star"
  "18:RWS_Tarot_18_Moon.jpg:the-moon"
  "19:RWS_Tarot_19_Sun.jpg:the-sun"
  "20:RWS_Tarot_20_Judgement.jpg:judgement"
  "21:RWS_Tarot_21_World.jpg:the-world"
)
for m in "${majors[@]}"; do
  IFS=":" read -r num file s <<< "$m"
  fetch "$file" "$OUT/major/${num}-${s}.jpg"
done

echo "Downloading Minor Arcana..."
ranks=(ace two three four five six seven eight nine ten page knight queen king)
# my-suit:WikimediaPrefix
suits=("wands:Wands" "cups:Cups" "swords:Swords" "pentacles:Pents")
for pair in "${suits[@]}"; do
  IFS=":" read -r suit prefix <<< "$pair"
  mkdir -p "$OUT/minor/$suit"
  for i in $(seq 1 14); do
    nn=$(printf "%02d" "$i")
    rank="${ranks[$((i - 1))]}"
    fetch "${prefix}${nn}.jpg" "$OUT/minor/$suit/${rank}-of-${suit}.jpg"
  done
done

echo ""
echo "Done. OK: $ok, Failed: $fails"
exit 0
