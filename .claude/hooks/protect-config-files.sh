#!/bin/bash
# protect-config-files.sh - Block edits to protected configuration files
#
# HOOK TYPE: PreToolUse (runs BEFORE Write/Edit tool executes)
# TRIGGER: Any attempt to write/edit a protected file
#
# PURPOSE:
# Enforces the AGENTS.md rule: "Always Ask First" for config files.
#
# Protected files include:
# - package.json / package-lock.json (dependencies)
# - tsconfig.json (TypeScript config)
# - biome.json (linting/formatting rules)
# - turbo.json (build pipeline)
# - vitest.config.ts (test configuration)
# - .env* (environment configuration)
#
# If Claude tries to edit these files, the edit is blocked with a warning.
# The user must explicitly approve changes to these files.
#
# EXIT CODES:
# - 0: File is not protected, edit can proceed
# - 1: File is protected, edit is blocked

filepath="$CLAUDE_FILE_PATH"

# List of protected file patterns (basename matching)
protected_files='package\.json|package-lock\.json|tsconfig\.json|biome\.json|turbo\.json|vitest\.config\.ts|\.env'

# Extract just the filename for matching
filename=$(basename "$filepath")

if echo "$filename" | grep -qE "^($protected_files)"; then
  echo "⚠️  BLOCKED: Attempting to modify protected file: $filepath"
  echo ""
  echo "This file requires explicit user approval per AGENTS.md."
  echo "Please confirm you want to modify this file."
  exit 1
fi
