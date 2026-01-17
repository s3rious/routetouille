#!/bin/bash
# lint-before-commit.sh - Run lint check on staged files before allowing git commit
#
# HOOK TYPE: PreToolUse (runs BEFORE Bash tool executes)
# TRIGGER: Any bash command containing "git commit"
#
# PURPOSE:
# Enforces the AGENTS.md rule: Code must pass lint before committing.
#
# Only lints staged TS/TSX files to keep it fast.
# If lint fails, the commit is blocked and Claude must fix the issues first.
#
# EXIT CODES:
# - 0: Lint passed (or no TS files staged), commit can proceed
# - 1: Lint failed, commit is blocked

if [[ "$CLAUDE_BASH_COMMAND" == *"git commit"* ]]; then
  # Get staged TS/TSX files (Added, Copied, Modified)
  staged_files=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|tsx)$')

  if [[ -z "$staged_files" ]]; then
    echo '✅ No TS/TSX files staged, skipping lint'
    exit 0
  fi

  echo '🔍 Linting staged files...'
  echo "$staged_files"

  # Run biome lint on staged files only
  if echo "$staged_files" | xargs npx biome lint --error-on-warnings; then
    echo '✅ Lint passed'
  else
    echo '❌ Lint failed! Fix errors before committing.'
    exit 1
  fi
fi
