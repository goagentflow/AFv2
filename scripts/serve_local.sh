#!/usr/bin/env bash
set -euo pipefail

# Simple local server for the static site
# Usage: PORT=3001 ./scripts/serve_local.sh

PORT="${PORT:-3000}"

cd "$(dirname "$0")/.."

echo "Serving $(pwd) at http://localhost:${PORT}"
echo "Press Ctrl+C to stop."

python3 -m http.server "${PORT}"

