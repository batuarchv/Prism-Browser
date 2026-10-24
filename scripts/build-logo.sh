#!/bin/sh
# Rebuilds every logo asset from the pyramid in assets/prism-pyramid.json: the vector logo (assets/prism-mark.svg),
# its PNGs, the app icon (assets/Prism-current.icns: the mark on transparent, as before), and the 3D renders and live
# mesh (scripts/blender/render-all.sh). Needs Electron (node_modules), macOS sips/iconutil and Blender.
set -e
cd "$(dirname "$0")/.."
node scripts/draw-mark.cjs
./node_modules/.bin/electron scripts/rasterize-mark.cjs
set=$(mktemp -d)/Prism.iconset; mkdir -p "$set"
for s in 16 32 128 256 512; do sips -z $s $s assets/prism-mark-flat.png --out "$set/icon_${s}x${s}.png" >/dev/null; d=$((s*2)); sips -z $d $d assets/prism-mark-flat.png --out "$set/icon_${s}x${s}@2x.png" >/dev/null; done
iconutil -c icns "$set" -o assets/Prism-current.icns
./scripts/blender/render-all.sh
