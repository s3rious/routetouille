# CLAUDE.md - Core Routetouille Package

This file provides guidance for working with the core routetouille package at `/packages/routetouille/`.

## Development Commands

- `npm run format` - Format code using Biome
- `npm run lint` - Lint and auto-fix code using Biome
- `npm run test` - Run Vitest tests
- `npm run test:coverage` - Run tests with coverage reporting
- `npm run build` - TypeScript compilation to `lib/` directory
- `npm run publish` - Publish to npm with public access
- `npx vitest run src/Route/WithName/WithName.test.ts` - Run single test file

## Package Architecture

### Core Design Pattern: Mixin Composition

The package uses a sophisticated mixin composition pattern where both `Router` and `Route` are built by composing multiple functional mixins:

```typescript
// Router composition (nested)
const Router = Subscribable(
  WithHistory(
    WithGoTo(
      WithUrlTo(
        WithSet(WithParams(WithPathname(WithActive(WithMap(WithRoot())))))
      )
    )
  )
);

// Route composition (nested)
const Route = WithChildren(
  WithAfterUnmount(
    WithAfterMount(
      WithBeforeUnmount(
        WithBeforeMount(Redirectable(Mountable(WithPath(WithName()))))
      )
    )
  )
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

## Deep Architecture Insights

### Route Resolution Algorithm (`WithActive`)

The route activation system uses a sophisticated multi-layer fallback mechanism:

1. **Exact Match**: First tries exact activator match in the route map
2. **Partial Path Matching**: Uses `getActivatorByPartialPath` to find routes matching partial segments
3. **Hierarchical Fallback Search**: Recursively searches up the tree for fallback routes
4. **Root Fallback**: Falls back to the first available fallback in the entire tree

```typescript
function getFinalRouteByActivator(map: RouteMap, activator: Activator): RouteMapRoute | undefined {
  // 1. Exact match
  const route = map.get(activator);
  if (route != null) return route;
  
  // 2. Partial path matching
  const partialActivator = getActivatorByPartialPath(map, activator);
  if (partialActivator != null) {
    const route = map.get(partialActivator);
    if (route != null) return route;
  }
  
  // 3. Hierarchical fallback search
  return getClosestFallbackByActivator(map, activator);
}
```

### Smart Route Diffing System

The activation system intelligently diffs current and next active routes to minimize DOM operations:

```typescript
function getRoutesToUnmount(current: Route[], next: Route[]): Route[] {
  return current.filter(route => !next.includes(route));
}

function getRoutesToMount(current: Route[], next: Route[]): Route[] {
  const same = current.filter(route => next.includes(route));
  return next.filter(route => !same.includes(route));
}
```

### Optimistic Navigation

Supports two navigation modes:

1. **Standard**: Waits for lifecycle hooks before updating active routes
2. **Optimistic**: Updates UI immediately, runs lifecycle hooks asynchronously

```typescript
if (isOptimistic) {
  this.active = nextActive;
  // Move lifecycle operations to next tick
  setTimeout(() => {
    void performUnmountMount(currentActive, nextActive);
  }, 0);
  return;
}
```

### Map Caching Strategy (`WithMap`)

Uses a WeakMap-like cache to avoid rebuilding route maps:

```typescript
const cache = new Map();

function getMap(this: WithMapInterface & ComposedInterface): RouteMap {
  const root = this.root;
  const cached = cache.get(root);
  
  if (cached) return cached;
  
  const map = extractMapFromRoot(root as AbstractRoute);
  cache.set(root, map);
  
  return map;
}
```

### Route Map Structure

Routes are stored in a flattened map with dot-notation keys preserving hierarchy:

```typescript
// Route tree:
// root
//   ├── home
//   │   └── about
//   └── products
//       └── details

// Map structure:
Map {
  "root" => { route, children: ["root.home", "root.products"] },
  "root.home" => { route, parent: "root", children: ["root.home.about"] },
  "root.home.about" => { route, parent: "root.home" },
  "root.products" => { route, parent: "root", children: ["root.products.details"] },
  "root.products.details" => { route, parent: "root.products" }
}
```

## Key Implementation Details

### Router Core Features

**Active Route Management** (`src/Router/WithActive/WithActive.ts`):
- Manages currently active routes in a tree structure
- Handles route activation/deactivation with lifecycle management
- Implements route diffing to minimize unnecessary mounts/unmounts
- Supports both optimistic and standard navigation modes

**History Integration** (`src/Router/WithHistory/WithHistory.ts`):
- Abstracts history management with pluggable providers
- Handles browser history integration with state management
- Manages scroll position restoration via GoToState
- Emits change events for external listeners

**Event System** (`src/Router/Subscribable/Subscribable.ts`):
- Uses nanoevents for lightweight event handling
- Emits `beforeActivate` and `afterActivate` events
- Allows external systems to hook into navigation lifecycle

### Route Lifecycle System

**Mount/Unmount Lifecycle** (`src/Route/Mountable/Mountable.ts`):
- Base `Mountable` provides core mount/unmount functionality
- Tracks mounted state with boolean flag
- Async-compatible for data loading operations

**Lifecycle Hook Order**:
1. `beforeMount` - Blocking async operations (auth checks, data preload)
2. `mount` - Set mounted flag to true
3. `afterMount` - Non-blocking async operations (analytics, lazy load)
4. `beforeUnmount` - Cleanup validation
5. `unmount` - Set mounted flag to false
6. `afterUnmount` - Final cleanup operations

**Async Lifecycle Management**:
- `beforeMount` blocks route activation (waits for promise)
- `afterMount` runs asynchronously in next tick
- Proper cleanup on route changes during async operations
- Error propagation through promise chain

### Path Handling and Parameters

**Path Type System** (`src/Route/WithPath/WithPath.ts`):
- **Slug**: Standard path patterns ending with `/` (e.g., `posts/`, `:id/`)
- **Search**: Query parameter patterns starting with `?` (e.g., `?edit`, `?page=:page`)
- **Hash**: Fragment patterns starting with `#` (e.g., `#section`, `#:anchor`)

**Parameter Extraction** (`src/Route/WithPath/params/extractParams.ts`):
- Regex-based parameter extraction from path patterns
- Supports dynamic segments like `:postId`
- Type-safe parameter handling with TypeScript
- Handles multiple parameters in single path

### Route Types and Composition

**Route Variants**:
- **Route**: Standard route with path and lifecycle
- **ModuleRoute**: Logical grouping without path (container routes)
- **FallbackRoute**: 404 handling and unmatched paths

**Composition Features**:
- **WithChildren**: Nested route support with parent-child relationships
- **Redirectable**: Conditional redirects with async validation
- **WithFallback**: Fallback handling within route trees
- **WithBeforeMount/AfterMount**: Lifecycle hook decorators

## Testing Patterns

### Test Organization
- Each mixin has its own test file: `[Component].test.ts`
- Tests are co-located with implementation files
- Shared test utilities in `src/Route/_tests-shared/index.ts`
- Coverage reports in `coverage/` directory

### Test Utilities

**`omitFunctions` utility**: Filters out functions from objects for clean assertions:
```typescript
function omitFunctions<Object extends {}>(route: Object): { [p: string]: unknown } {
  return Object.fromEntries(
    Object.entries(route).filter(([_key, value]) => typeof value !== "function"),
  );
}
```

**Mock Route Creation**:
```typescript
const mockRoute = {
  mount: vi.fn(),
  unmount: vi.fn(),
  mounted: false,
};
```

### Testing Patterns
- **Mixin Extension Testing**: Verifies mixins properly extend composed functionality
- **Lifecycle Testing**: Comprehensive async lifecycle testing with mock functions
- **Integration Testing**: Complex router scenarios with nested routes and redirects
- **Error Handling**: Edge cases and invalid input handling
- **Parameter Testing**: Dynamic parameter extraction and type safety

## Performance Optimizations

### 1. Map Caching
- Route map is cached after first build
- Cache invalidated only when root changes
- Avoids expensive tree traversal on every navigation

### 2. Smart Diffing
- Only mounts/unmounts routes that actually changed
- Preserves existing route instances
- Minimizes DOM operations and re-renders

### 3. Optimistic Navigation
- UI updates immediately for better perceived performance
- Lifecycle hooks run asynchronously
- Rollback mechanism if navigation fails

### 4. Event System
- Lightweight nanoevents (< 1KB)
- Minimal overhead for event emission
- Efficient listener management

## Key Utilities and Helper Functions

### History Abstraction

**`HistoryInterface` (`src/History/index.ts`)**:
- Event-driven history management
- Pluggable history providers (Browser, Memory, Custom)
- State management with scroll position tracking

```typescript
type HistoryInterface = {
  pathname: string | null;
  push: (pathname: string | null, state?: unknown) => void;
  replace: (pathname: string | null, state?: unknown) => void;
  emitter: Emitter<Events>;
};
```

### Parameter Utilities

**Parameter Detection and Extraction**:
- `hasParams`: Detects if path contains parameters
- `extractParams`: Extracts parameter values from paths
- Type-safe parameter handling with TypeScript

```typescript
// hasParams("posts/:id/") => true
// extractParams("posts/:id/", "posts/123/") => { id: "123" }
```

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
    const customMethod = () => {
      // Access composed properties via 'this'
      console.log(this.name);
    };
    
    return { ...composed, customMethod };
  };
}

// Usage
const CustomRouter = CustomMixin(Router);
```

### Custom Route Types

Extend existing route types or create new ones:

```typescript
// Analytics-enabled route
const AnalyticsRoute = WithAnalytics(
  WithChildren(
    WithAfterMount(
      WithBeforeMount(Mountable(WithPath(WithName())))
    )
  )
);

// Usage
AnalyticsRoute({
  name: 'tracked-page',
  path: '/tracked/',
  analyticsId: 'page_123',
  afterMount: async () => {
    // Analytics automatically tracked
  }
});
```

### Custom History Providers

Implement the `HistoryInterface` for custom environments:

```typescript
function CustomHistory(): HistoryInterface {
  const emitter = createNanoEvents<Events>();
  let currentPath: string | null = null;
  
  return {
    get pathname() { return currentPath; },
    push: (pathname: string | null, state?: unknown) => {
      currentPath = pathname;
      emitter.emit('change', pathname, state);
    },
    replace: (pathname: string | null, state?: unknown) => {
      currentPath = pathname;
      emitter.emit('change', pathname, state);
    },
    emitter
  };
}
```

## Configuration Files

### TypeScript Configuration
**`tsconfig.json`**: 
- Strict mode enabled for maximum type safety
- ES2024 target for modern JavaScript features
- Declaration files generated for package consumers
- Module resolution set to NodeNext

### Biome Configuration
**`biome.json`**: 
- Comprehensive linting with import extension enforcement
- 2-space indentation
- Import organization enabled
- Unused imports cleanup

### Vitest Configuration
**`vitest.config.ts`**: 
- JSDOM environment for DOM-related tests
- V8 coverage provider for accurate coverage reports
- Optimized for component testing
- Global test utilities available

## Package-Specific Architectural Decisions

### 1. Framework Agnostic Design
- No UI framework dependencies
- Event-driven architecture for external integration
- Pure JavaScript/TypeScript implementation
- Works in any JavaScript environment

### 2. TypeScript-First Approach
- Extensive type safety with generic mixin system
- Complex type inference for composed interfaces
- Full IDE support with autocompletion
- Type guards for runtime safety

### 3. Async-First Lifecycle
- All lifecycle operations support async/await
- Proper error handling and propagation
- Cancellation support for in-flight operations
- Race condition prevention

### 4. Minimal Dependencies
- Only dependency is `nanoevents` (< 1KB)
- No polyfills required
- Tree-shakeable exports
- Small bundle size impact

## Advanced Patterns and Use Cases

### 1. Route Guards
```typescript
Route({
  name: 'protected',
  beforeMount: async () => {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      throw new Error('Unauthorized');
    }
  }
});
```

### 2. Data Preloading
```typescript
Route({
  name: 'posts',
  beforeMount: async () => {
    // Blocks navigation until data loaded
    await loadPosts();
  },
  afterMount: async () => {
    // Non-blocking operations
    trackPageView();
  }
});
```

### 3. Nested Fallbacks
```typescript
ModuleRoute({
  name: 'app',
  children: [
    Route({ name: 'home', path: '/' }),
    ModuleRoute({
      name: 'admin',
      children: [
        Route({ name: 'dashboard', path: 'dashboard/' }),
        FallbackRoute({ name: 'admin-404' }) // Admin-specific 404
      ]
    }),
    FallbackRoute({ name: 'app-404' }) // App-wide 404
  ]
});
```

### 4. Dynamic Route Building
```typescript
function buildRoutes(features: string[]): Route[] {
  return features.map(feature => Route({
    name: feature,
    path: `${feature}/`,
    // Dynamic route configuration
  }));
}
```

## Key Files to Understand

**Router Core**:
- `src/Router/Router.ts` - Main router composition
- `src/Router/WithActive/WithActive.ts` - Route activation logic and diffing
- `src/Router/WithMap/WithMap.ts` - Route mapping and resolution
- `src/Router/Subscribable/Subscribable.ts` - Event system

**Route Core**:
- `src/Route/Route.ts` - Main route composition
- `src/Route/Mountable/Mountable.ts` - Base mount/unmount functionality
- `src/Route/WithPath/WithPath.ts` - Path handling and parameters
- `src/Route/Redirectable/Redirectable.ts` - Redirect logic

**History System**:
- `src/History/BrowserHistory/BrowserHistory.ts` - Browser history implementation
- `src/History/index.ts` - History interface and types

**Utilities**:
- `src/Route/WithPath/params/extractParams.ts` - Parameter extraction
- `src/Route/_tests-shared/index.ts` - Testing utilities