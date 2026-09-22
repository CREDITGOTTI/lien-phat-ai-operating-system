#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")/.."
ROOT="$(pwd)"
LOG="$ROOT/deployment.log"
PACKAGE="$ROOT/deploy/Lien-Phat-AI-cPanel-Prebuilt.zip"

exec > >(tee -a "$LOG") 2>&1

echo "============================================================"
echo "LIEN PHAT AI prebuilt cPanel deployment"
date
echo "Application root: $ROOT"
echo "============================================================"

if [ ! -f "$PACKAGE" ]; then
  echo "ERROR: Prebuilt package not found:"
  echo "$PACKAGE"
  echo "Wait for the GitHub Actions build to finish, then Update from Remote in cPanel."
  exit 1
fi

if ! command -v unzip >/dev/null 2>&1; then
  echo "ERROR: unzip is not available on this cPanel account."
  exit 1
fi

echo "[1/3] Installing prebuilt application..."
rm -rf "$ROOT/.output"
unzip -oq "$PACKAGE" -d "$ROOT"

echo "[2/3] Verifying runtime..."
if [ ! -f "$ROOT/.output/server/index.mjs" ]; then
  echo "ERROR: .output/server/index.mjs is missing from the prebuilt package."
  exit 1
fi

echo "Runtime found: .output/server/index.mjs"

echo "[3/3] Restarting Passenger..."
mkdir -p "$ROOT/tmp"
touch "$ROOT/tmp/restart.txt"

echo "DEPLOYMENT COMPLETE — no npm install or server-side build was performed."
date
