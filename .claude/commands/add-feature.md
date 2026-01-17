# Add Feature

Implement the feature: $ARGUMENTS

## Process

### Phase 1: Research
1. **Run `/learn`** to understand current mixin patterns
2. **Analyze codebase** - Find similar implementations, relevant mixins
3. **Identify unknowns** - What needs clarification?

### Phase 2: Clarify
Ask user questions about unclear aspects:
- Scope boundaries (what's in/out?)
- Which package does this belong in? (core/react/redux)
- Does this need a new mixin or extend existing one?
- Lifecycle hooks needed?
- Edge cases to handle

### Phase 3: Design
Present implementation plan:
```
## Feature: [name]

**Package:** [routetouille/react-routetouille/redux-routetouille]

**Files to create:**
- [list with paths]

**Files to modify:**
- [list with paths and what changes]

**Mixin composition:**
- [How it fits into existing WithX(WithY(Base)) chain]

**Lifecycle hooks:**
- [beforeMount/afterMount if needed]

**Tests:**
- [Test cases to write]
```

### Phase 4: Confirm
**STOP and wait for user approval before writing any code.**

### Phase 5: Implement
Only after user says OK:
1. Implement following the approved plan
2. Write co-located tests (*.test.ts)
3. Run `npm run lint` and `npm run test`
4. Ask user before committing

## Requirements

- Follow mixin composition pattern `WithX(WithY(Base))`
- No `any` types - use `unknown` or proper generics
- Zero runtime dependencies in core package
- Co-located tests with source files