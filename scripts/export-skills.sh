#!/usr/bin/env bash
# export-skills.sh — Empacota cada skill em um ZIP individual pronto
# pra instalar no Claude Desktop via Settings > Skills > Install from ZIP
#
# Uso: ./scripts/export-skills.sh
# Saída: dist/skills/<agente>.zip (um por agente)

set -euo pipefail

SKILLS_DIR="$(cd "$(dirname "$0")/../skills" && pwd)"
OUT_DIR="$(cd "$(dirname "$0")/.." && pwd)/dist/skills"

mkdir -p "$OUT_DIR"

AGENTS=(atlas hefesto hermes prometheus astraea iris)

for agent in "${AGENTS[@]}"; do
  skill_path="$SKILLS_DIR/$agent"

  if [ ! -d "$skill_path" ]; then
    echo "SKIP $agent — pasta não encontrada em skills/$agent"
    continue
  fi

  if [ ! -f "$skill_path/SKILL.md" ]; then
    echo "SKIP $agent — SKILL.md não encontrado"
    continue
  fi

  out_zip="$OUT_DIR/${agent}.zip"

  # ZIP com a pasta como raiz (ex: atlas/SKILL.md dentro do zip)
  (cd "$SKILLS_DIR" && zip -r "$out_zip" "$agent/" -x "*.DS_Store" -x "*__pycache__*")

  echo "OK   $agent → dist/skills/${agent}.zip"
done

echo ""
echo "Feito. ZIPs em dist/skills/"
echo "Instalar: Claude Desktop → Settings → Skills → Install from ZIP"
