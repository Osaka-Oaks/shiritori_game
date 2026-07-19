#!/usr/bin/env bash
# Summarize build-history.jsonl for terminal or CI step summary.
set -euo pipefail

HISTORY="${1:-.github/build-history.jsonl}"
OUT="${2:-}"

if [ ! -f "$HISTORY" ]; then
  echo "No build history at $HISTORY"
  exit 0
fi

report() {
  echo "## Build time tracking"
  echo ""
  echo "| App | Step | Duration | Status | When |"
  echo "|-----|------|----------|--------|------|"
  tail -20 "$HISTORY" | jq -r '[.app,.step,(.duration_s|tostring+"s"),.status,.timestamp] | @tsv' \
    | while IFS=$'\t' read -r app step dur status ts; do
      echo "| $app | $step | $dur | $status | $ts |"
    done
  echo ""
  echo "### Averages (last 50 runs)"
  tail -50 "$HISTORY" | jq -s '
    group_by(.app + "/" + .step)
    | map({
        key: (.[0].app + "/" + .[0].step),
        avg_s: (map(.duration_s) | add / length | floor),
        count: length,
        success: (map(select(.status=="success")) | length)
      })
    | .[]
    | "| \(.key) | \(.avg_s)s | \(.count) runs | \(.success)/\(.count) ok |"
  ' -r | while read -r line; do
    [ -n "$line" ] && echo "$line"
  done
  echo ""
  echo "| Target | Step | Avg |"
  echo "|--------|------|-----|"
  tail -50 "$HISTORY" | jq -s '
    group_by(.app + "/" + .step)
    | map(select(.[0].step=="build"))
    | .[]
    | "| \(.[0].app) | build | \((map(.duration_s)|add/length|floor))s |"
  ' -r
}

if [ -n "$OUT" ]; then
  report >> "$OUT"
else
  report
fi
