#!/usr/bin/env bash
# Validate Terraform and OpenTofu configs from repo root.
# Usage: bash infra/validate-iac.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

need() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "❌ $1 not found. Install:"
    echo "   brew install terraform opentofu"
    echo "   https://developer.hashicorp.com/terraform/install"
    echo "   https://opentofu.org/docs/intro/install/"
    exit 1
  fi
}

validate_stack() {
  local tool=$1 dir=$2
  echo ""
  echo "━━━ $tool → $dir ━━━"
  need "$tool"
  (cd "$dir" && "$tool" init -backend=false -input=false && "$tool" fmt -check -recursive ../.. && "$tool" validate)
  echo "✅ $tool validate OK"
}

validate_stack terraform infra/terraform/environments/dev
validate_stack tofu infra/opentofu/environments/dev

echo ""
echo "All IaC validation passed."
