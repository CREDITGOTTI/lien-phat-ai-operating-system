#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")/.."
ROOT="$(pwd)"
LOG="$ROOT/deployment.log"

exec > >(tee -a "$LOG") 2>&1

echo "============================================================"
echo "LIEN PHAT AI cPanel deployment"
date
echo "Application root: $ROOT"
echo "============================================================"

find_node_bin() {
  for dir in     /opt/cpanel/ea-nodejs22/bin     /opt/cpanel/ea-nodejs20/bin     /opt/cpanel/ea-nodejs24/bin
  do
    if [ -x "$dir/node" ] && [ -x "$dir/npm" ]; then
      echo "$dir"
      return 0
    fi
  done

  if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
    dirname "$(command -v node)"
    return 0
  fi

  return 1
}

NODE_BIN="$(find_node_bin || true)"
if [ -z "$NODE_BIN" ]; then
  echo "ERROR: A usable Node.js/npm installation was not found."
  echo "Enable Node.js 20.19+ or 22.12+ in cPanel before deploying."
  exit 1
fi

export PATH="$NODE_BIN:$PATH"
export NODE_ENV=production
export NITRO_PRESET=node-server

echo "Node: $(node --version)"
echo "npm:  $(npm --version)"

NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
NODE_MINOR="$(node -p 'process.versions.node.split(".")[1]')"

if [ "$NODE_MAJOR" -lt 20 ] || { [ "$NODE_MAJOR" -eq 20 ] && [ "$NODE_MINOR" -lt 19 ]; }; then
  echo "ERROR: Node $(node --version) is too old for Vite 8."
  echo "Use Node 20.19+ or Node 22.12+."
  exit 1
fi

if [ ! -f package.json ]; then
  echo "ERROR: package.json is missing from $ROOT."
  exit 1
fi

if [ ! -f .env ]; then
  echo "WARNING: No .env file was found in the application root."
  echo "The site can build only if the required VITE_SUPABASE_* values are supplied another way."
fi

echo
echo "[1/4] Installing dependencies..."
npm install --include=dev --no-package-lock --no-audit --no-fund

echo
echo "[2/4] Building production Node server..."
rm -rf .output
npm run build

echo
echo "[3/4] Verifying build output..."
if [ ! -f .output/server/index.mjs ]; then
  echo "ERROR: Build finished but .output/server/index.mjs was not created."
  find .output -maxdepth 3 -type f 2>/dev/null | sort || true
  exit 1
fi

if [ ! -d .output/public ]; then
  echo "WARNING: .output/public was not created."
fi

echo "Build entry found: .output/server/index.mjs"

echo
echo "[4/4] Restarting Passenger..."
mkdir -p tmp
touch tmp/restart.txt

echo
echo "DEPLOYMENT COMPLETE"
date
