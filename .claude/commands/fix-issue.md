# Fix Issue

Fix the issue: $ARGUMENTS

## Process

### Phase 1: Research
1. **Understand the problem** - Read error messages, relevant code
2. **Reproduce** - Confirm the issue exists and when it occurs
3. **Find root cause** - Trace through mixin chain, check `git log` for recent changes

### Phase 2: Clarify
Ask user about unclear aspects:
- Is my understanding of the bug correct?
- Expected vs actual behavior?
- Which mixin/component is affected?
- Any constraints on the fix approach?

### Phase 3: Design
Present fix plan:
```
## Issue: [description]

**Root cause:**
[What's actually wrong - mixin order? lifecycle timing? type issue?]

**Files to modify:**
- [file:line] - [what change]

**Fix approach:**
[How we'll fix it without breaking mixin composition]

**Risk assessment:**
- [What could break]
- [How we'll verify]

**Testing:**
- [Test cases to add/update]
```

### Phase 4: Confirm
**STOP and wait for user approval before making changes.**

### Phase 5: Fix
Only after user says OK:
1. Implement the minimal fix
2. Add/update tests for the fix
3. Run `npm run lint` and `npm run test`
4. Ask user before committing