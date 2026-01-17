# Write Tests

Write tests for: $ARGUMENTS

## Steps

1. **Find similar test files** for patterns:
   ```bash
   ls -lt packages/routetouille/src/Router/*/*.test.ts | head -3
   ls -lt packages/routetouille/src/Route/*/*.test.ts | head -3
   ```

2. **Read 1-2 test files** to understand patterns

3. **Plan test cases**:
   - Happy path scenarios
   - Edge cases (empty arrays, undefined, null)
   - Error conditions
   - Async lifecycle hook behavior (if applicable)

4. **Write tests** following project conventions:
   - Co-locate with source as `*.test.ts`
   - Use Vitest + jsdom
   - Use React Testing Library for React components

5. **Run tests**: `npx vitest run path/to/file.test.ts`

6. **Check coverage**: `npm run test:coverage`

## Test Structure

```typescript
import { describe, it, expect, vi } from 'vitest';

describe('WithFeature', () => {
  it('should handle happy path', () => {
    // Arrange, Act, Assert
  });

  it('should handle edge case', () => {
    // Test boundary conditions
  });

  it('should call lifecycle hooks in order', async () => {
    // Test beforeMount, afterMount, etc.
  });
});
```

## Mixin Testing Checklist

- [ ] Composition with base mixin works
- [ ] Options are passed correctly
- [ ] Interface methods are exposed
- [ ] Lifecycle hooks called in correct order

## Arguments

$ARGUMENTS: File or component to test
