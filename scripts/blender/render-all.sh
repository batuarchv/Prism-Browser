#!/bin/sh
# Renders every shipped logo asset from scripts/blender/prism-logo.py: the light/dark Cycles stills (small logos and
# fallbacks), the mesh for the live WebGL logo (src/glass-model.js) and the glTF model in design/.
set -e
cd "$(dirname "$0")/../.."
B=${BLENDER:-/Applications/Blender.app/Contents/MacOS/Blender};S=scripts/blender/prism-logo.py
mkdir -p design
"$B" -b -P $S -- design/unused.png --model src/glass-model.js
"$B" -b -P $S -- assets/prism-glass.png --size 1024 --samples 256 --glb design/prism-logo.glb
"$B" -b -P $S -- assets/prism-glass-dark.png --size 1024 --samples 256 --dark
