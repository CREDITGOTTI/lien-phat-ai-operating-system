#!/bin/bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PACKAGE="$REPO_ROOT/deploy/Lien-Phat-AI-cPanel-Prebuilt.zip"

# Per cPanel's deployment model, keep the managed Git repository separate
# from the live production application.
DEPLOY_ROOT="${LIENPHAT_DEPLOY_ROOT:-$HOME/lien-phat-ai-production}"
LOG="$HOME/lien-phat-ai-deployment.log"

exec > >(tee -a "$LOG") 2>&1

echo "============================================================"
echo "LIEN PHAT AI prebuilt cPanel deployment"
date
echo "Git repository: $REPO_ROOT"
echo "Production app: $DEPLOY_ROOT"
echo "============================================================"

if [ ! -f "$PACKAGE" ]; then
  echo "ERROR: Prebuilt package not found:"
  echo "$PACKAGE"
  echo "Run the GitHub Actions prebuilt workflow, then click Update from Remote in cPanel."
  exit 1
fi

UNZIP_BIN="$(command -v unzip || true)"
if [ -z "$UNZIP_BIN" ]; then
  echo "ERROR: unzip is not available on this cPanel account."
  exit 1
fi

echo "[1/4] Preparing production directory..."
mkdir -p "$DEPLOY_ROOT"
rm -rf "$DEPLOY_ROOT/.output"

echo "[2/4] Installing prebuilt application..."
"$UNZIP_BIN" -oq "$PACKAGE" -d "$DEPLOY_ROOT"

# Keep the Passenger startup files beside the prebuilt Nitro output.
cp -f "$REPO_ROOT/app.js" "$DEPLOY_ROOT/app.js"
cp -f "$REPO_ROOT/package.json" "$DEPLOY_ROOT/package.json"
cp -f "$REPO_ROOT/.env.example" "$DEPLOY_ROOT/.env.example"

echo "[3/4] Verifying production package..."
if [ ! -f "$DEPLOY_ROOT/.output/server/index.mjs" ]; then
  echo "ERROR: Missing $DEPLOY_ROOT/.output/server/index.mjs"
  exit 1
fi

if [ ! -d "$DEPLOY_ROOT/.output/public" ]; then
  echo "ERROR: Missing $DEPLOY_ROOT/.output/public"
  exit 1
fi

echo "Server entry: $DEPLOY_ROOT/.output/server/index.mjs"
echo "Public assets: $DEPLOY_ROOT/.output/public"

echo "[4/4] Restarting Passenger..."
mkdir -p "$DEPLOY_ROOT/tmp"
touch "$DEPLOY_ROOT/tmp/restart.txt"

cat > "$DEPLOY_ROOT/DEPLOYED_BUILD.txt" <<EOF
LIEN PHAT AI
Git repository: $REPO_ROOT
Package: $PACKAGE
Deployed at: $(date -u +%Y-%m-%dT%H:%M:%SZ)
EOF

echo
echo "DEPLOYMENT COMPLETE"
echo "cPanel Node Application Root: lien-phat-ai-production"
echo "Startup file: app.js"
echo "Deployment log: $LOG"
date
