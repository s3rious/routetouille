# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Root Level (Turbo monorepo)
- `npm run format` - Format all packages using Biome
- `npm run lint` - Lint all packages using Biome 
- `npm run test` - Run tests for all packages
- `npm run typecheck` - Run TypeScript type checking
- `npm run build` - Build all packages
- `npm run publish` - Publish all packages
- `npm run upgrade` - Upgrade dependencies across packages

### Package Level
Commands can be run in `/packages/routetouille`, `/packages/react-routetouille`, or `/packages/redux-routetouille`:
- `npm run format` - Format using Biome
- `npm run lint` - Lint using Biome (with --write flag)
- `npm run test` - Run Vitest tests
- `npm run test:coverage` - Run tests with coverage
- `npm run build` - TypeScript compilation to `lib/` directory
- `npm run publish` - Publish to npm with public access
- `npm run upgrade` - Upgrade dependencies
- `npx vitest run path/to/file.test.ts` - Run single test file

### Testing
- Tests are colocated with source files as `*.test.ts` or `*.test.tsx`
- Uses Vitest testing framework with jsdom environment
- React tests use `@testing-library/react`
- Coverage reports generated in `coverage/` directory
- **Wallaby.js**: Live testing across all packages (`wallaby.config.js`)

### Build Pipeline (Turbo)
The Turbo pipeline executes tasks in this dependency order:
1. `format` → `lint` → `typecheck` → `test` → `build` → `publish`
2. Build tasks depend on upstream packages being built first (`^build`)
3. Outputs are cached for `dist/**` and `lib/**` directories

## High-Level Architecture

### Core Design Pattern: Mixin Composition

Routetouille uses a functional composition pattern where functionality is built through nested mixins:

```typescript
// Router = 10 nested mixins providing complete routing functionality
Router = Subscribable(WithHistory(WithGoTo(WithUrlTo(WithSet(WithParams(WithPathname(WithActive(WithMap(WithRoot())))))))))

// Route = 9 nested mixins providing lifecycle and behavior
Route = WithChildren(WithAfterUnmount(WithAfterMount(WithBeforeUnmount(WithBeforeMount(Redirectable(Mountable(WithPath(WithName()))))))))
```

### Key Architectural Insights

#### 1. Route Resolution Algorithm
The router uses a sophisticated multi-layer fallback system:
- **Exact Match**: Direct activator lookup in route map
- **Partial Path Matching**: Finds routes matching partial segments
- **Hierarchical Fallback**: Recursively searches up the tree
- **Root Fallback**: Falls back to first available fallback

#### 2. Smart Route Diffing
Activation system intelligently diffs routes to minimize DOM operations:
- Only unmounts routes that are no longer active
- Only mounts new routes not previously active
- Preserves existing route instances when possible

#### 3. Optimistic Navigation
Two navigation modes for different UX needs:
- **Standard**: Waits for lifecycle hooks before updating UI
- **Optimistic**: Updates UI immediately, runs hooks asynchronously

#### 4. Map Caching Strategy
Route maps are cached for performance:
- Built once from route tree
- Cached using root route as key
- Invalidated only when root changes

### Lifecycle System

**Route Lifecycle Order**:
1. `beforeMount` - Blocking async operations (auth, data preload)
2. `mount` - Set mounted flag
3. `afterMount` - Non-blocking async operations (analytics)
4. `beforeUnmount` - Cleanup validation
5. `unmount` - Clear mounted flag
6. `afterUnmount` - Final cleanup

**Router Events**:
- `beforeActivate` - Before route change
- `afterActivate` - After route change (triggers React state sync)

## Package Structure

### `/packages/routetouille` - Core Router
- Framework-agnostic routing library
- Event-driven architecture with nanoevents
- Sophisticated route resolution and fallback system
- Optimistic navigation support
- Minimal dependencies (only nanoevents)
- **[See detailed documentation](packages/routetouille/CLAUDE.md)**

### `/packages/react-routetouille` - React Bindings
- React 19+ integration with concurrent features
- Three rendering strategies (tree, lastActive, lastExclusiveAndTree)
- useSyncExternalStore for optimal performance
- Scroll restoration with dual-tick strategy
- SSR/SSG support patterns
- **[See detailed documentation](packages/react-routetouille/CLAUDE.md)**

### `/packages/redux-routetouille` - Redux Bindings
- Single composable HOC for complete Redux integration
- `WithRedux` provides both state and dispatch
- Uses React 18's `useSyncExternalStore` for optimal performance
- Object parameters in lifecycle hooks for composability
- Framework-agnostic (works with any UI library)
- **[See detailed documentation](packages/redux-routetouille/CLAUDE.md)**

### `/examples`
- `/react` - React with Redux integration patterns
  - **[See detailed documentation](examples/react/CLAUDE.md)**
- `/react-complex-app` - Domain-driven design with Effector
  - **[See detailed documentation](examples/react-complex-app/CLAUDE.md)**
- `/no-framework` - Vanilla JavaScript implementation
  - **[See detailed documentation](examples/no-framework/CLAUDE.md)**

## Key Implementation Patterns

### Mixin Composition Pattern
```typescript
function WithFeature<ComposedOptions extends {}, ComposedInterface extends {}>(
  createComponent?: (options: ComposedOptions) => ComposedInterface,
) {
  return (options: WithFeatureOptions & ComposedOptions): WithFeatureInterface & ComposedInterface => {
    const composed = createComponent?.(options) ?? ({} as ComposedInterface);
    // Add feature-specific functionality
    return { ...composed, /* new properties/methods */ };
  };
}
```

### React Integration Pattern
```typescript
// HOC composition for React + Redux
const route = WithRedux(WithReactComponent(Route))({
  name: 'dashboard',
  path: '/dashboard',
  store,
  component: ({ state, dispatch }) => (
    <Dashboard state={state} dispatch={dispatch} />
  ),
  beforeMount: async ({ state, dispatch }) => {
    if (!state.auth.isAuthenticated) {
      await router.goTo('/login');
    }
  },
});
```

### Rendering Strategy Selection
```typescript
// Choose rendering strategy based on use case
renderTree(router, active);              // Standard nested layouts
renderLastActive(router, active);        // Single component
renderLastExclusiveAndTree(router, active); // Layout boundaries
```

## Key Files to Understand

### Core Router
- `packages/routetouille/src/Router/Router.ts` - Main router composition
- `packages/routetouille/src/Router/WithActive/WithActive.ts` - Route activation and diffing
- `packages/routetouille/src/Router/WithMap/WithMap.ts` - Route mapping with caching
- `packages/routetouille/src/Route/Mountable/Mountable.ts` - Base mount/unmount

### React Bindings
- `packages/react-routetouille/src/hooks/useRouterRoot.ts` - Core React integration
- `packages/react-routetouille/src/strategies/renderLastExclusiveAndTree.ts` - Smart boundary rendering
- `packages/react-routetouille/src/Route/WithReactRoot/WithReactRoot.ts` - React app root

### Redux Bindings
- `packages/redux-routetouille/src/WithRedux.ts` - Complete Redux integration wrapper providing both state and dispatch

## Development Guidelines

### Code Style
- Biome for formatting and linting (2 spaces, LF endings)
- TypeScript with strict mode enabled
- ES modules only (`"type": "module"`)
- No use of `any`; use `unknown` or proper types
- Prefer `const` and immutability
- No magic numbers/strings

### Testing
- Vitest with co-located test files
- Mock utilities in `_tests-shared` directories
- React Testing Library for component tests
- Coverage reports with V8 provider

### Architecture Principles
- **Framework Agnostic**: Core has no UI dependencies
- **Composition Over Inheritance**: Mixins compose functionality
- **Type Safety**: Extensive TypeScript generics
- **Async First**: All lifecycle hooks support promises
- **Minimal Dependencies**: Only essential packages

## Performance Considerations

### 1. Route Map Caching
- Maps built once and cached
- Avoids expensive tree traversal

### 2. Smart Diffing
- Only mount/unmount changed routes
- Preserves existing instances

### 3. Optimistic Navigation
- Immediate UI updates
- Better perceived performance

### 4. React 18 Features
- useSyncExternalStore for Redux
- Concurrent rendering support
- Automatic batching

### 5. Rendering Strategies
- Choose strategy based on use case
- Exclusive routes prevent re-renders
- Boundary rendering for layout isolation

## Common Patterns

### Route Guards
```typescript
beforeMount: async ({ state }) => {
  if (!state.auth.isAuthenticated) {
    await router.goTo('/login');
  }
}
```

### Data Preloading
```typescript
beforeMount: async () => {
  await loadPosts(); // Blocks navigation
},
afterMount: async () => {
  trackPageView(); // Non-blocking
}
```

### Dynamic Routes
```typescript
Route({
  name: 'post',
  path: ':postId/',
  afterMount: async () => {
    const id = getParam(router.params, 'postId');
    await fetchPost(id);
  },
})
```

## Commit Guidelines

- NEVER add Co-Authored-By lines to commits
- Use clear, descriptive commit messages
- Small, focused commits
- Follow existing patterns in the codebase

## Package-Specific Documentation

Each package has detailed CLAUDE.md with:

- **[Core Router](packages/routetouille/CLAUDE.md)** - Mixin architecture, route resolution algorithm, performance optimizations
- **[React Bindings](packages/react-routetouille/CLAUDE.md)** - Rendering strategies, hooks architecture, SSR patterns
- **[Redux Bindings](packages/redux-routetouille/CLAUDE.md)** - Single HOC for complete Redux integration, lifecycle hooks with state and dispatch
- **[React Example](examples/react/CLAUDE.md)** - Redux integration patterns, component architecture
- **[React Complex App](examples/react-complex-app/CLAUDE.md)** - Domain-driven design, Effector state management
- **[No-Framework Example](examples/no-framework/CLAUDE.md)** - Vanilla JS patterns, DOM manipulation