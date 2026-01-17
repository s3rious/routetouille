# Refactor Code

Refactor: $ARGUMENTS

## Process

### Phase 1: Research
1. **Run `/learn`** to understand current patterns
2. **Analyze current code** - What specifically needs refactoring?
3. **Identify dependencies** - What else uses this mixin/code?

### Phase 2: Clarify
Ask user about unclear aspects:
- What's the main goal? (readability, DRY, performance, modernize)
- Scope boundaries?
- Any code that must stay unchanged?
- Breaking changes acceptable?

### Phase 3: Design
Present refactoring plan:
```
## Refactor: [target]

**Current issues:**
- [Issue 1]
- [Issue 2]

**Proposed changes:**
- [File 1] - [what changes]
- [File 2] - [what changes]

**Mixin impact:**
[How this affects the WithX(WithY(Base)) chain]

**Preserved behavior:**
[What stays the same]

**Risk assessment:**
- [What could break]
- [How we'll verify with tests]
```

### Phase 4: Confirm
**STOP and wait for user approval before refactoring.**

### Phase 5: Refactor
Only after user says OK:
1. Implement in small incremental steps
2. Run tests after each step
3. Run `npm run lint` and `npm run test`
4. Ask user before committing
