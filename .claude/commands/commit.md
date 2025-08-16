# Git Commit

Commit the currently staged files to git: $ARGUMENTS

Commit process:
1. Run git status to see all staged changes
2. Run git diff --cached to see the staged changes that will be committed
3. Run git log --oneline -10 to see recent commit messages for style consistency
4. Analyze the staged changes and draft a commit message
5. Create the commit with the drafted message

Commit message structure:
```
<What's done>

<Why it was done>

- <List>
- <Of detailed>
- <Changes>
```

Commit message guidelines:
- First line: Clear, concise description of what was done
- Second section: Explain the motivation or reason for the change
- Third section: Bullet points detailing specific changes
- Use present tense (e.g., "Add feature" not "Added feature")
- Keep the first line under 50 characters when possible
- Follow the existing commit message style in the repository

IMPORTANT RULES:
- Don't add "Generated with Claude Code", "Co-Authored-By: Claude", or "Test plan" to commits or PRs
- Never add Claude-specific signatures or attributions
- Keep commit messages clean and professional
- Focus on the technical changes and their purpose

Error handling:
- If no files are staged, inform the user and suggest staging files first
- If commit fails, show the error and suggest solutions
- Never force commit or bypass hooks