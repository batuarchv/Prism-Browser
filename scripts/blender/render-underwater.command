#!/bin/sh
# Double-click: renders the underwater logo scene to design/renders/prism-underwater.png and opens it.
set -e -o pipefail 2>/dev/null || set -e
cd "$(dirname "$0")/../.."
B=${BLENDER:-/Applications/Blender.app/Contents/MacOS/Blender}
mkdir -p design/renders
[ -f design/prism-logo.blend ] || "$B" -b -P scripts/blender/prism-logo.py -- --blend design/prism-logo.blend
{ "$B" -b design/prism-logo.blend --python-exit-code 1 -P scripts/blender/prism-underwater.py -- design/renders/prism-underwater.png --blend design/renders/prism-underwater.blend || PRISM_CPU=1 "$B" -b design/prism-logo.blend --python-exit-code 1 -P scripts/blender/prism-underwater.py -- design/renders/prism-underwater.png --blend design/renders/prism-underwater.blend; } 2>&1 | tee design/renders/underwater.log
open design/renders/prism-underwater.png
