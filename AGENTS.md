# Routetouille

> Modern, extensible, lifecycle-driven routing ecosystem for JavaScript/TypeScript with mixin composition architecture.

## Bash Commands

- `npm run format`: Format all packages (Biome)
- `npm run lint`: Lint all packages (Biome)
- `npm run test`: Run Vitest tests for all packages
- `npm run typecheck`: TypeScript type checking
- `npm run build`: Build all packages (Turbo)
- `npx vitest run path/to/file.test.ts`: Run single test file

## Tech Stack

- **Language**: TypeScript 5.8+ (strict mode)
- **Target**: ES2024, ES modules only
- **Framework**: React 19+ (for bindings)
- **Package Manager**: npm with Turbo monorepo
- **Testing**: Vitest + jsdom + React Testing Library
- **Linting/Formatting**: Biome (replaces ESLint + Prettier)

## IMPORTANT: Before Writing Code

YOU MUST understand the project's code style before producing any code. Read recently modified files in these folders to learn current patterns:

- `packages/routetouille/src/Router/` - Core router mixin patterns
- `packages/routetouille/src/Route/` - Route mixin patterns
- `packages/react-routetouille/src/hooks/` - React hook patterns
- `packages/redux-routetouille/src/` - Redux HOC pattern

Use `ls -lt <folder> | head -5` to find recently modified files, then read them to understand the current code style before implementing anything new.

## Project Structure

```
packages/
  routetouille/           # Core router (framework-agnostic, 0 runtime deps)
  react-routetouille/     # React bindings with hooks
  redux-routetouille/     # Redux integration HOC
examples/
  react/                  # React + Redux example
  react-complex-app/      # Domain-driven with Effector
  no-framework/           # Vanilla JavaScript
```

## Code Style

### Naming Conventions

- Files: `PascalCase.ts` for mixins, `camelCase.ts` for utilities
- Components/Mixins: `PascalCase` (e.g., `WithReactComponent`)
- Functions: `camelCase` (e.g., `renderTree`)
- Constants: `SCREAMING_SNAKE` for true constants
- Types/Interfaces: `PascalCase` with descriptive suffixes (`Options`, `Interface`)

### Formatting (Biome)

- Indent: 2 spaces
- Line endings: LF (Unix)
- Import extensions: REQUIRED (`.ts`, `.js`)
- Unused imports: Auto-removed
- Import organization: Auto-sorted

### TypeScript Rules

- **IMPORTANT**: Strict mode enabled - no implicit any
- **IMPORTANT**: Never use `any` - use `unknown` or proper generics
- Prefer `const` and immutability
- No magic numbers/strings - use named constants

## Architecture: Mixin Composition

**IMPORTANT**: This codebase uses nested mixin composition. Every feature is a composable function.

### Pattern
```typescript
function WithFeature<Opts extends {}, Iface extends {}>(
  createComponent?: (options: Opts) => Iface,
) {
  return (options: WithFeatureOptions & Opts): WithFeatureInterface & Iface => {
    const composed = createComponent?.(options) ?? ({} as Iface);
    return { ...composed, /* new properties */ };
  };
}
```

### Core Compositions
```typescript
// Router = 10 nested mixins
Router = Subscribable(WithHistory(WithGoTo(WithUrlTo(WithSet(
  WithParams(WithPathname(WithActive(WithMap(WithRoot())))))))))

// Route = 9 nested mixins
Route = WithChildren(WithAfterUnmount(WithAfterMount(
  WithBeforeUnmount(WithBeforeMount(
    Redirectable(Mountable(WithPath(WithName()))))))))
```

## Patterns to Follow

- **Mixins**: `packages/routetouille/src/Router/WithActive/WithActive.ts`
- **React hooks**: `packages/react-routetouille/src/hooks/useRouterRoot.ts`
- **Redux HOC**: `packages/redux-routetouille/src/WithRedux.ts`
- **Tests**: `packages/routetouille/src/Router/WithActive/WithActive.test.ts`

## Anti-Patterns to Avoid

| Don't | Do Instead |
|-------|------------|
| Break mixin composition order | Follow existing `WithX(WithY(Base))` nesting |
| Use `any` type | Use `unknown` or proper generics with type guards |
| Skip lifecycle hooks | Implement `beforeMount`/`afterMount` for data loading |
| Use wrong rendering strategy | Choose `renderTree`, `renderLastActive`, or `renderLastExclusiveAndTree` appropriately |
| Add runtime dependencies | Keep core packages at 0 deps (dev deps OK) |
| Copy deprecated patterns | Check if pattern is in active use before copying |

## Lifecycle Hooks

**Route Lifecycle Order**:
1. `beforeMount` - Blocking async (auth, data preload)
2. `mount` - Set mounted flag
3. `afterMount` - Non-blocking async (analytics)
4. `beforeUnmount` - Cleanup validation
5. `unmount` - Clear mounted flag
6. `afterUnmount` - Final cleanup

**IMPORTANT**: Always implement `beforeMount` for route guards and data preloading.

## Testing

- **Location**: Co-located as `*.test.ts` or `*.test.tsx`
- **Framework**: Vitest with jsdom environment
- **React**: Use `@testing-library/react`
- **Coverage target**: 80%+
- **Run single test**: `npx vitest run path/to/file.test.ts`

## Git Workflow

- **Main branch**: master
- **Commit style**: Imperative mood, 5-10 words (e.g., "Add user authentication")
- **IMPORTANT**: Never add Co-Authored-By lines to commits
- Small, focused commits following existing patterns

## IMPORTANT: Permissions

### Always Ask First

- Installing ANY new dependencies (runtime deps should be 0)
- Modifying `package.json` dependency sections
- Deleting files
- Modifying CI/CD config (`.github/workflows/`)
- Changing authentication/security code
- Force pushing or rewriting git history

### Safe to Auto-Execute

- Running tests (`npm run test`)
- Running linter/formatter (`npm run lint`, `npm run format`)
- Running typecheck (`npm run typecheck`)
- Reading files
- Git status/diff/log
- Creating new files in appropriate directories
- Running dev server

## Domain Terminology

- **Mixin**: Composable function that wraps and extends base functionality (e.g., `WithActive`, `WithHistory`)
- **Exclusive**: Route marked exclusive creates layout boundary, preventing parent re-renders
- **Optimistic navigation**: UI updates immediately while lifecycle hooks run async
- **Route map**: Cached lookup table built from route tree for fast resolution

## Extended Thinking

Use `think hard` or `ultrathink` for:
- Architecture decisions affecting mixin composition
- Complex debugging across multiple mixins
- Performance optimization in route resolution
- Changes to core Router or Route composition

## Package-Specific Docs

For detailed architecture, see package CLAUDE.md files:
- Core: `packages/routetouille/CLAUDE.md` - Router/Route mixin architecture
- React: `packages/react-routetouille/CLAUDE.md` - Hooks, rendering strategies
- Redux: `packages/redux-routetouille/CLAUDE.md` - WithRedux HOC details

---

*Generated by /rackup - Update after major refactors*