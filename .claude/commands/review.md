# Review Code

Review code against AGENTS.md patterns: $ARGUMENTS

## Steps

1. **Get code to review**:
   - If file specified: Read that file
   - If empty: Run `git diff origin/master`

2. **Check against AGENTS.md**:
   - Mixin composition correct? (`WithX(WithY(Base))`)
   - No `any` types? (use `unknown` or generics)
   - Import extensions present? (`.ts`, `.js`)
   - Lifecycle hooks implemented where needed?
   - Tests co-located with source?
   - Zero runtime deps in core package?

3. **Report findings**:
   - 🔴 Must fix - violates AGENTS.md rules (broken mixin, `any` type)
   - 🟡 Should fix - code smell or inconsistency
   - 🟢 Consider - optional improvement
   - ✅ Looks good

## Routetouille-Specific Checks

- [ ] Mixin composition follows `WithX(WithY(Base))` pattern
- [ ] No `any` types - uses `unknown` or proper generics
- [ ] Lifecycle hooks implemented where needed
- [ ] Tests co-located with source files (`*.test.ts`)
- [ ] No new runtime dependencies in core package

## Arguments

$ARGUMENTS: File path or empty for recent changes
