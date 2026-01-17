# Learn Patterns

Read recent files to understand project code style before implementing.

## Steps

1. **Find recent files** in key directories:
   ```bash
   ls -lt packages/routetouille/src/Router/ | head -5
   ls -lt packages/routetouille/src/Route/ | head -5
   ls -lt packages/react-routetouille/src/hooks/ | head -5
   ls -lt packages/redux-routetouille/src/ | head -5
   ```

2. **Read 2-3 recent files** from each relevant category

3. **Identify patterns**:
   - Mixin composition: `WithX(WithY(Base))` nesting order
   - Type definitions: `Options` and `Interface` suffixes
   - Lifecycle hooks: `beforeMount`, `afterMount`, etc.
   - Test structure: co-located `*.test.ts` files
   - Import style: extensions required, auto-sorted

4. **Summarize** key patterns to follow

## Output

After learning, briefly report:
- Mixin patterns observed
- Type patterns to follow
- Test patterns to replicate
- Utilities to reuse

## Arguments

$ARGUMENTS: Optional focus area (e.g., "Router", "hooks", "tests")
