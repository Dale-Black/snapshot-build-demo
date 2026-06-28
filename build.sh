#!/usr/bin/env bash
# The blessed Snapshot build hook. Snapshot runs THIS in your own GitHub Actions
# and publishes whatever it writes to the output dir (snapshot.toml [app] output,
# default dist/). It can be ANY toolchain — this one is plain Node (no Julia, no
# npm install). Install tools, fetch data, render pages: it's your build.
set -euo pipefail
cd "$(dirname "$0")"

echo "▶ custom build: rendering the site with Node → dist/"
node build.mjs

echo "✓ dist/ ready ($(find dist -type f | wc -l | tr -d ' ') files)"
