# CLAUDE.md - Core Routetouille Package

This file provides guidance for working with the core routetouille package at `/packages/routetouille/`.

## Development Commands

- `npm run format` - Format code using Biome
- `npm run lint` - Lint and auto-fix code using Biome
- `npm run test` - Run Vitest tests
- `npm run test:coverage` - Run tests with coverage reporting
- `npm run build` - TypeScript compilation to `lib/` directory
- `npm run publish` - Publish to npm with public access

## Package Architecture

### Core Design Pattern: Mixin Composition

The package uses a sophisticated mixin composition pattern where both `Router` and `Route` are built by composing multiple functional mixins:

```typescript
// Router composition (nested)
const Router = Subscribable(
  WithHistory(
    WithGoTo(
      WithUrlTo(
        WithSet(WithParams(WithPathname(WithActive(WithMap(WithRoot()))))),
      ),
    ),
  ),
);

// Route composition (nested)
const Route = WithChildren(
  WithAfterUnmount(
    WithAfterMount(
      WithBeforeUnmount(
        WithBeforeMount(Redirectable(Mountable(WithPath(WithName())))),
      ),
    ),
  ),
);
```

### Mixin Implementation Pattern

Each mixin follows this consistent pattern:

```typescript
function WithFeature<ComposedOptions extends {}, ComposedInterface extends {}>(
  createComponent?: (options: ComposedOptions) => ComposedInterface,
) {
  return (
    options: WithFeatureOptions & ComposedOptions,
  ): WithFeatureInterface & ComposedInterface => {
    const composed: ComposedInterface = createComponent?.(options) ?? ({} as ComposedInterface);
    
    // Feature-specific implementation
    
    return { ...composed, /* new properties/methods */ };
  };
}
```

## Key Implementation Details

### Router Core Features

**Active Route Management** (`src/Router/WithActive/WithActive.ts`):
- Manages currently active routes in a tree structure
- Handles route activation/deactivation with lifecycle management
- Implements route diffing to minimize unnecessary mounts/unmounts

**History Integration** (`src/Router/WithHistory/WithHistory.ts`):
- Abstracts history management with pluggable providers
- Handles browser history integration with state management
- Manages scroll position restoration

### Route Lifecycle System

**Mount/Unmount Lifecycle** (`src/Route/Mountable/Mountable.ts`):
- Base `Mountable` provides core mount/unmount functionality
- Lifecycle hooks implemented as decorating mixins:
  - `WithBeforeMount`: Blocking operations before mounting
  - `WithAfterMount`: Non-blocking operations after mounting (async)
  - `WithBeforeUnmount`: Validation/cleanup before unmounting
  - `WithAfterUnmount`: Final cleanup after unmounting

**Async Lifecycle Management**:
- `beforeMount` blocks route activation
- `afterMount` runs asynchronously in the next tick
- Proper cleanup on route changes during async operations

### Path Handling and Parameters

**Path Type System** (`src/Route/WithPath/WithPath.ts`):
- `Slug`: Standard path patterns ending with `/`
- `Search`: Query parameter patterns starting with `?`
- `Hash`: Fragment patterns starting with `#`

**Parameter Extraction** (`src/Route/WithPath/params/extractParams.ts`):
- Regex-based parameter extraction from path patterns
- Supports dynamic segments like `:postId`
- Type-safe parameter handling

### Route Types and Composition

**Route Variants**:
- `Route`: Standard route with path and lifecycle
- `ModuleRoute`: Logical grouping without path
- `FallbackRoute`: 404 handling and unmatched paths

**Composition Features**:
- `WithChildren`: Nested route support
- `Redirectable`: Conditional redirects with async validation
- `WithFallback`: Fallback handling within route trees

## Testing Patterns

### Test Organization
- Each mixin has its own test file: `[Component].test.ts`
- Tests are co-located with implementation files
- Shared test utilities in `src/Route/_tests-shared/index.ts`

### Test Utilities
**`omitFunctions` utility**: Filters out functions from objects for clean assertions:
```typescript
function omitFunctions<Object extends {}>(route: Object): { [p: string]: unknown } {
  return Object.fromEntries(
    Object.entries(route).filter(([_key, value]) => typeof value !== "function"),
  );
}
```

### Testing Patterns
- **Mixin Extension Testing**: Verifies mixins properly extend composed functionality
- **Lifecycle Testing**: Comprehensive async lifecycle testing with mock functions
- **Integration Testing**: Complex router scenarios with nested routes and redirects
- **Error Handling**: Edge cases and invalid input handling

## Key Utilities and Helper Functions

### History Abstraction
**`HistoryInterface` (`src/History/index.ts`)**:
- Event-driven history management
- Pluggable history providers (Browser, Memory, Custom)
- State management with scroll position tracking

### Parameter Utilities
**Parameter Detection and Extraction**:
- `hasParams`: Detects if path contains parameters
- `extractParams`: Extracts parameter values from paths
- Type-safe parameter handling with TypeScript

## Extension and Modification Guidelines

### Creating Custom Mixins
To extend router functionality:
```typescript
function CustomMixin<ComposedOptions extends {}, ComposedInterface extends {}>(
  createComponent?: (options: ComposedOptions) => ComposedInterface,
) {
  return (options: CustomOptions & ComposedOptions): CustomInterface & ComposedInterface => {
    const composed = createComponent?.(options) ?? ({} as ComposedInterface);
    // Custom implementation
    return { ...composed, /* custom properties */ };
  };
}
```

### Custom Route Types
Extend existing route types or create new ones:
```typescript
const CustomRoute = WithCustomFeature(
  WithChildren(
    WithAfterMount(
      WithBeforeMount(Mountable(WithPath(WithName())))
    )
  )
);
```

### Custom History Providers
Implement the `HistoryInterface` for custom environments:
```typescript
function CustomHistory(): HistoryInterface {
  return {
    pathname: string | null,
    push: (pathname: string | null, state?: unknown) => void,
    replace: (pathname: string | null, state?: unknown) => void,
    emitter: Emitter<Events>
  };
}
```

## Configuration Files

### TypeScript Configuration
**`tsconfig.json`**: Strict mode enabled, ES2024 target, declaration files generated

### Biome Configuration
**`biome.json`**: Comprehensive linting with import extension enforcement, 2-space indentation

### Vitest Configuration
**`vitest.config.ts`**: JSDOM environment, V8 coverage provider, optimized for component testing

## Package-Specific Architectural Decisions

1. **Framework Agnostic Design**: No UI framework dependencies, event-driven architecture
2. **TypeScript-First Approach**: Extensive type safety with generic mixin system
3. **Async-First Lifecycle**: All lifecycle operations support async/await
4. **Minimal Dependencies**: Only dependency is `nanoevents` for event handling

## Key Files to Understand

**Router Core**:
- `src/Router/Router.ts` - Main router composition
- `src/Router/WithActive/WithActive.ts` - Route activation logic
- `src/Router/WithMap/WithMap.ts` - Route mapping and resolution

**Route Core**:
- `src/Route/Route.ts` - Main route composition
- `src/Route/Mountable/Mountable.ts` - Base mount/unmount functionality
- `src/Route/WithPath/WithPath.ts` - Path handling and parameters

**History System**:
- `src/History/BrowserHistory/BrowserHistory.ts` - Browser history implementation
- `src/History/index.ts` - History interface and types