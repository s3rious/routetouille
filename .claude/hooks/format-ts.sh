#!/bin/bash
# format-ts.sh - Auto-format TypeScript files after Claude edits them
#
# HOOK TYPE: PostToolUse (runs AFTER Write/Edit completes)
# TRIGGER: Any .ts or .tsx file is written or edited
#
# PURPOSE:
# Ensures all TypeScript code matches the project's Biome configuration:
# - 2 spaces indentation
# - LF line endings
# - Import extensions required
# - Unused imports removed
# - Import organization sorted
#
# This runs silently - errors are suppressed to avoid blocking workflow
# if Biome isn't available or file has syntax errors.

filepath="$CLAUDE_FILE_PATH"

if [[ "$filepath" == *.ts ]] || [[ "$filepath" == *.tsx ]]; then
  npx biome format --write "$filepath" 2>/dev/null
fi
