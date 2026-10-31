#!/bin/sh
# Double-click to open the glass logo in Blender: builds design/prism-logo.blend from scripts/blender/prism-logo.py
# (same scene the renders use: mesh, glass material, studio lights, logo camera) and opens it.
set -e
cd "$(dirname "$0")/../.."
B=${BLENDER:-/Applications/Blender.app/Contents/MacOS/Blender}
"$B" -b -P scripts/blender/prism-logo.py -- --blend design/prism-logo.blend
open -a Blender design/prism-logo.blend
