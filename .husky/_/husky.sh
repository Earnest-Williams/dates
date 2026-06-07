#!/usr/bin/env sh
# This is a simplified husky.sh for environments where the full husky installation is not available
# It provides basic functionality to run pre-commit hooks

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Get the git hook name from the calling script
HOOK_NAME="$(basename "$0")"

# Run the hook script if it exists
if [ -f "$SCRIPT_DIR/../$HOOK_NAME" ]; then
  exec "$SCRIPT_DIR/../$HOOK_NAME" "$@"
fi
