# CLAUDE.md - React Routetouille Package

This file provides guidance for working with the React bindings package at `/packages/react-routetouille/`.

## Development Commands

- `npm run format` - Format code using Biome
- `npm run lint` - Lint and auto-fix code using Biome
- `npm run test` - Run Vitest tests with React Testing Library
- `npm run test:coverage` - Run tests with coverage reporting
- `npm run build` - TypeScript compilation to `lib/` directory
- `npm run publish` - Publish to npm with public access

## Package Overview

React-Routetouille provides idiomatic React hooks, components, and context for seamless integration with the core Routetouille router. Built as a lightweight wrapper focusing on React-specific patterns and lifecycle integration.

## Core Architecture

### Context System (`src/Context/`)

Simple React Context for router state management:

```typescript
type ContextValue = { router: RouterInterface | undefined };
const Context: ReactContext<ContextValue> = createContext<ContextValue>({
  router: undefined,
});
```

**Key Features:**
- Single context for router instance
- Graceful undefined handling
- DisplayName set for debugging
- Type-safe context value

### Hook System (`src/hooks/`)

#### `useRouter()`
Base hook that returns the router instance from context with graceful undefined handling.

#### `useRouterRoot()` - **Primary Integration Hook**
**Critical for root-level router integration**:

```typescript
function useRouterRoot<Route extends {}, Router extends AbstractRouter<Route>>(
  router: Router,
  { logger, verbose }: UseRouterRootOptions = {},
): {
  router: Router;
  active: Route[];
}
```

**Key Features:**
- Subscribes to `afterActivate` events to sync React state
- Handles scroll position restoration on navigation
- Optional verbose logging for development
- Generic type support for custom route types

#### `useLink()` - **Sophisticated Link Handling**
Advanced hook for generating href URLs and click handlers:

```typescript
function useLink<LinkActivator extends Activator, LinkParams extends Params>({
  to,
  params,
  optimistic,
  saveScrollPosition,
  href: hrefProp,
}: UseLinkProps<LinkActivator, LinkParams>): UseLink
```

**Advanced Features:**
- Fallback to `hrefProp` when router unavailable
- Scroll position preservation before navigation
- Event prevention for SPA navigation
- Generic type constraints for type safety

### Route Enhancement System (`src/Route/`)

#### `WithReactComponent`
Higher-order function that adds React component support to routes:

```typescript
type WithReactComponentOptions = {
  component: FunctionComponent<WithReactComponentProps>;
  exclusive?: boolean;
};

// Usage
const route = WithReactComponent(Route)({
  name: 'dashboard',
  path: '/dashboard',
  component: DashboardComponent,
  exclusive: true
});
```

**Key Features:**
- Composable with other route enhancers
- Type-safe component props
- Exclusive rendering support
- Generic composition pattern

#### `WithReactRoot` - **Advanced Route Enhancer**
For full React application roots:

```typescript
type WithReactRootOptions = {
  beforeMount?: () => Promise<void>;
  afterMount?: () => Promise<void>;
  afterUnmount?: () => Promise<void>;
  id: string;
  preloaderId?: string;
  router: RouterInterface;
  component: FunctionComponent<WithReactRootComponentProps>;
};
```

**Advanced Features:**
- Full React app lifecycle management
- DOM container creation and cleanup
- React 18 createRoot API usage
- Preloader removal after mount
- Strict mode wrapping
- Async lifecycle hooks

### Rendering Strategies (`src/strategies/`)

#### `renderTree()` - **Default Strategy**
Renders all active routes with components:
```typescript
const result = renderTree(router, activeRoutes);
```

#### `renderLastActive()` - **Simple Last-Route Rendering**
Renders only the last active route:
```typescript
const result = renderLastActive(router, activeRoutes);
```

#### `renderLastExclusiveAndTree()` - **Advanced Exclusive Rendering**
Finds last exclusive route and renders from there:
```typescript
const result = renderLastExclusiveAndTree(router, activeRoutes);
```

#### `renderRecurse()` - **Core Recursive Utility**
Handles nested component composition:
```typescript
const result = renderRecurse(router, routes, renderingFunction);
```

## React Integration Patterns

### Provider Pattern
```typescript
function App() {
  return (
    <RoutetouilleProvider router={router}>
      <MainView />
    </RoutetouilleProvider>
  );
}
```

### Hook-Based Navigation
```typescript
function Navigation() {
  const { active, params, pathname } = useRoute();
  const goTo = useGoTo();
  
  return (
    <nav>
      <button onClick={() => goTo('home')}>Home</button>
      <div>Current: {active.map(r => r.name).join(' > ')}</div>
    </nav>
  );
}
```

### Component-Based Routes
```typescript
const route = WithReactComponent(Route)({
  name: 'dashboard',
  path: '/dashboard',
  component: DashboardComponent,
  exclusive: true
});
```

## Testing Patterns

### Hook Testing with React Testing Library
```typescript
const { result } = renderHook(() => useRouter(), {
  wrapper: ({ children }) => 
    withContextValue({ router: mockRouter }, children),
});
```

### Component Testing
```typescript
const result = renderTree(router, [route1, route2]);
const { getAllByText } = render(result);
expect(getAllByText("Component").length).toBeGreaterThan(0);
```

### Mock Patterns
```typescript
const mockRouter = {
  urlTo: vi.fn(() => "/foo"),
  goTo: vi.fn(),
  history: { emitter: { on: vi.fn() } },
  getMap: vi.fn(),
  activate: vi.fn(),
  active: []
};
```

## Key Development Considerations

### 1. Type Safety
- Heavy use of generics for route and parameter types
- Composition patterns with higher-order functions
- Strict TypeScript configuration with ES2024 features

### 2. Performance Optimizations
- React.memo opportunities in components
- useMemo and useCallback for expensive operations
- Selective re-rendering based on route changes

### 3. SSR/SSG Support
- Server-side rendering compatible hooks
- Hydration-safe router state management
- No browser-specific code in core hooks

### 4. Extension Points
- Custom rendering strategies can be implemented
- Hook composition for complex use cases
- Route enhancer composition for custom behavior

## Testing Strategy

### Test Organization
- Each hook/component has its own test file
- Tests co-located with implementation
- React Testing Library for component tests
- Vitest with jsdom environment

### Test Patterns
- **Hook Testing**: Use `renderHook` with appropriate wrappers
- **Component Testing**: Test rendering strategies and components
- **Integration Testing**: Full router + React integration scenarios
- **Mock Testing**: Comprehensive router mocking for isolation

## Configuration Files

### TypeScript Configuration
**`tsconfig.json`**: Strict mode, ES2024 target, NodeNext modules, declaration files

### Biome Configuration  
**`biome.json`**: Strict linting, import extensions, unused imports cleanup

### Vitest Configuration
**`vitest.config.ts`**: jsdom environment, V8 coverage provider, React testing setup

## Integration with Core Router

### Router Interface Usage
- Uses `RouterInterface` type from routetouille core
- Event subscription for lifecycle hooks
- History integration for navigation state
- Type-safe activators and parameters

### Lifecycle Integration
- `afterActivate` events for state synchronization
- History change events for scroll restoration
- Mount/unmount lifecycle for components

### Navigation Patterns
- Programmatic navigation via goTo
- Declarative navigation via Link components
- URL generation via urlTo
- State preservation during navigation

## Key Files to Understand

**Context and Hooks**:
- `src/Context/Context.ts` - React context setup
- `src/hooks/useRouterRoot.ts` - Primary router integration hook
- `src/hooks/useLink.ts` - Advanced link handling

**Route Enhancement**:
- `src/Route/WithReactComponent/WithReactComponent.ts` - Component route enhancement
- `src/Route/WithReactRoot/WithReactRoot.ts` - Full React app integration

**Rendering Strategies**:
- `src/strategies/renderTree.ts` - Default rendering strategy
- `src/strategies/renderLastExclusiveAndTree.ts` - Advanced exclusive rendering
- `src/strategies/renderRecurse.ts` - Core recursive utility

## Package-Specific Development Workflow

### Development Cycle
```bash
npm run format && npm run lint && npm run test
```

### Build Process
- TypeScript compilation to lib/ directory
- Declaration files for type support
- ES modules with .js extensions
- Strict linting before build

### Dependencies
- **Peer Dependencies**: React 19+, routetouille core
- **Dev Dependencies**: React Testing Library, Vitest, TypeScript, Biome