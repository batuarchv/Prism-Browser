#!/bin/sh
# Arguments are supplied by the verified main process, never evaluated as shell code.
set -eu
pid=$1
bundle=$2
stage=$3
failure=$4
version=$5
count=0
while kill -0 "$pid" 2>/dev/null; do
  count=$((count+1))
  if [ "$count" -ge 150 ]; then exit 1; fi
  sleep 0.2
done
if ! /bin/mv "$bundle" "$stage/Previous.app"; then exit 1; fi
if ! /bin/mv "$stage/Prism.app" "$bundle"; then
  /bin/mv "$stage/Previous.app" "$bundle"
  printf '%s\n' "$version" > "$failure"
  /usr/bin/open "$bundle"
  exit 1
fi
if ! /usr/bin/open -n "$bundle"; then
  /bin/mv "$bundle" "$stage/Failed.app"
  /bin/mv "$stage/Previous.app" "$bundle"
  printf '%s\n' "$version" > "$failure"
  /usr/bin/open "$bundle"
  exit 1
fi
