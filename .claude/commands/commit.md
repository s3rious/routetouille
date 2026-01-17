# Commit Changes

Commit staged files: $ARGUMENTS

## Steps

1. **Check staged changes**:
   ```bash
   git status
   git diff --cached
   ```

2. **Get current user's commit style**:
   ```bash
   git config user.name
   git log --author="$(git config user.name)" -3 --format="%B---"
   ```

3. **Analyze user's full commit messages** (not just first line):
   - Title format and length
   - How they explain the "why"
   - Level of detail in bullet points
   - Vocabulary and tone

4. **Draft commit message** matching user's style:
   ```
   Short title (imperative, under 50 chars)

   Context explaining why this change was made and what problem
   it solves. 1-2 sentences.

   - Specific change with detail
   - Another specific change
   - More changes as needed
   ```

5. **Create the commit**

## Rules

- Match the user's personal commit message style exactly
- Title: imperative mood ("Add" not "Added"), under 50 chars
- Body: explain the motivation/context
- Bullets: specific, detailed changes
- NEVER add "Generated with Claude Code" or Co-Authored-By
- If no files staged, inform user to stage first
