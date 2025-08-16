# CLAUDE.md - React Routetouille Package

This file provides guidance for working with the React bindings package at `/packages/react-routetouille/`.

## Development Commands

- `npm run format` - Format code using Biome
- `npm run lint` - Lint and auto-fix code using Biome
- `npm run test` - Run Vitest tests with React Testing Library
- `npm run test:coverage` - Run tests with coverage reporting
- `npm run build` - TypeScript compilation to `lib/` directory
- `npm run publish` - Publish to npm with public access
- `npx vitest run src/hooks/useLink.test.ts` - Run single test file

## Package Overview

React-Routetouille provides idiomatic React hooks, components, and context for seamless integration with the core Routetouille router. Built as a lightweight wrapper focusing on React-specific patterns and lifecycle integration.

## Core Architecture Deep Dive

### Context System (`src/Context/`)

Simple yet powerful React Context for router state management:

```typescript
type ContextValue = { router: RouterInterface | undefined };
const Context: ReactContext<ContextValue> = createContext<ContextValue>({
  router: undefined,
});
```

**Key Design Decisions:**
- Single context for router instance (no context splitting)
- Graceful undefined handling for SSR compatibility
- DisplayName set for React DevTools debugging
- Type-safe context value with proper generics

### Hook System Architecture

#### `useRouterRoot()` - **The Heart of React Integration**

This is the most critical hook that bridges Routetouille's event-driven architecture with React's state management:

```typescript
function useRouterRoot<Route extends {}, Router extends AbstractRouter<Route>>(
  router: Router,
  { logger, verbose }: UseRouterRootOptions = {},
): {
  router: Router;
  active: Route[];
}
```

**Deep Implementation Details:**

1. **State Synchronization**: Uses `afterActivate` events to sync router state with React
2. **Scroll Restoration**: Implements dual-tick scroll restoration for reliable positioning
   ```typescript
   if (isGoToState(state)) {
     globalThis.scrollTo(0, state.scrollTop);
     // Second tick ensures scroll after render
     setTimeout(() => globalThis.scrollTo(0, state.scrollTop), 0);
   }
   ```
3. **Dependency Management**: Carefully managed effect dependencies prevent memory leaks
4. **Performance**: Only triggers re-renders on actual route changes

#### `useLink()` - **Advanced Navigation Hook**

Sophisticated hook that handles all navigation edge cases:

```typescript
function useLink<LinkActivator extends Activator, LinkParams extends Params>({
  to,
  params,
  optimistic,
  saveScrollPosition,
  href: hrefProp,
}: UseLinkProps<LinkActivator, LinkParams>): UseLink
```

**Advanced Features Explained:**

1. **Graceful Degradation**: Falls back to `hrefProp` when router unavailable (SSR)
2. **Scroll Position Preservation**: Captures scroll before navigation
   ```typescript
   if (saveScrollPosition) {
     const scrollTop = globalThis.scrollY || globalThis.pageYOffset || 0;
     router.goTo(to, { params, optimistic, scrollTop });
   }
   ```
3. **Event Prevention**: Smart handling of modifier keys and special clicks
4. **Type Constraints**: Generic constraints ensure type safety for activators and params

### Route Enhancement System

#### `WithReactComponent` - **Component Integration Pattern**

Higher-order function that adds React component support to routes:

```typescript
type WithReactComponentOptions = {
  component: FunctionComponent<WithReactComponentProps>;
  exclusive?: boolean; // Controls rendering strategy
};
```

**Implementation Insights:**
- Composable with other route enhancers via generic typing
- Type-safe component props with intersection types
- Exclusive rendering support for layout boundaries
- Maintains route interface compatibility

#### `WithReactRoot` - **Application Root Management**

Advanced route enhancer for full React application roots:

```typescript
type WithReactRootOptions = {
  beforeMount?: () => Promise<void>;
  afterMount?: () => Promise<void>;
  afterUnmount?: () => Promise<void>;
  id: string;                 // DOM container ID
  preloaderId?: string;        // Optional preloader to remove
  router: RouterInterface;
  component: FunctionComponent<WithReactRootComponentProps>;
};
```

**Sophisticated Features:**

1. **DOM Container Management**: Creates and manages root container
2. **React 18 Integration**: Uses `createRoot` API for concurrent features
3. **Preloader Removal**: Automatic cleanup of loading indicators
4. **Strict Mode Wrapping**: Development-only StrictMode for better debugging
5. **Lifecycle Ordering**: Proper sequencing of async operations

### Rendering Strategies In-Depth

#### `renderTree()` - **Default Hierarchical Rendering**

Renders all active routes with components in nested structure:

```typescript
function renderTree<Route extends {}, Router extends AbstractRouter<Route>>(
  router: Router,
  active: Route[],
): ReactElement | null {
  const componentRoutes = active.filter(isWithReactComponent);
  return React.createElement(
    Context.Provider,
    { value: { router } },
    renderRecurse(router, componentRoutes),
  );
}
```

**Use Cases:**
- Standard nested layouts (header → content → footer)
- Progressive enhancement of UI
- Maintains full route hierarchy

#### `renderLastActive()` - **Minimal Rendering**

Renders only the last active route:

```typescript
function renderLastActive<Route extends {}, Router extends AbstractRouter<Route>>(
  router: Router,
  active: Route[],
): ReactElement | null
```

**Use Cases:**
- Single-page components without nesting
- Modal or overlay routes
- Performance-critical scenarios

#### `renderLastExclusiveAndTree()` - **Smart Boundary Rendering**

Finds the last exclusive route and renders from there:

```typescript
function renderLastExclusiveAndTree<Route extends {}, Router extends AbstractRouter<Route>>(
  router: Router,
  active: Route[],
): ReactElement | null {
  const lastExclusiveIndex = findLastIndex(componentRoutes, "exclusive", true);
  if (lastExclusiveIndex > -1) {
    componentRoutes = componentRoutes.slice(lastExclusiveIndex, componentRoutes.length);
  }
  return renderRecurse(router, componentRoutes);
}
```

**Deep Implementation Details:**
1. **Boundary Detection**: Uses custom `findLastIndex` for reverse search
2. **Slice Optimization**: Only renders from boundary forward
3. **Layout Isolation**: Prevents parent layouts from affecting exclusive sections

**Use Cases:**
- Authentication boundaries (public vs private sections)
- Different layout systems (admin vs user areas)
- Micro-frontend boundaries

#### `renderRecurse()` - **Core Rendering Engine**

The heart of all rendering strategies:

```typescript
function renderRecurse<Route extends WithReactComponentInterface>(
  router: RouterInterface,
  routes: Route[],
  renderingFunction?: (route: Route) => ReactNode,
): ReactElement | null
```

**Sophisticated Features:**
1. **Custom Rendering Functions**: Allows injection of custom rendering logic
2. **Nested Composition**: Handles deep nesting with proper prop passing
3. **Type Safety**: Maintains type integrity through recursion
4. **Performance**: Minimal React element creation

## React Integration Patterns

### Provider Pattern with TypeScript

```typescript
function App() {
  const { router, active } = useRouterRoot(router, {
    logger: console,
    verbose: process.env.NODE_ENV === 'development'
  });
  
  return (
    <RoutetouilleProvider router={router}>
      {renderLastExclusiveAndTree(router, active)}
    </RoutetouilleProvider>
  );
}
```

### Advanced Hook Composition

```typescript
function useAdvancedNavigation() {
  const router = useRouter();
  const { active, params, pathname } = useRoute();
  const goTo = useGoTo();
  
  const navigateWithAnalytics = useCallback((to: string) => {
    analytics.track('navigation', { from: pathname, to });
    return goTo(to);
  }, [pathname, goTo]);
  
  return { active, params, pathname, navigateWithAnalytics };
}
```

### Component-Based Routes with Exclusive Rendering

```typescript
const AuthBoundary = WithReactComponent(Route)({
  name: 'auth-boundary',
  path: '/app',
  component: AuthLayout,
  exclusive: true, // Creates rendering boundary
});

const PublicBoundary = WithReactComponent(Route)({
  name: 'public-boundary',
  path: '/',
  component: PublicLayout,
  exclusive: true,
});
```

## Performance Optimization Techniques

### 1. React 18 Optimizations

**useSyncExternalStore Integration:**
- Automatic batching of state updates
- Concurrent features support
- Tearing prevention in concurrent mode

```typescript
// In WithReduxState wrapper
const state = useSyncExternalStore(
  store.subscribe,
  store.getState,
  store.getState, // Server snapshot
);
```

### 2. Rendering Strategy Selection

Choose the right strategy for performance:

| Strategy | Re-renders | Use Case |
|----------|-----------|----------|
| `renderTree` | All active routes | Standard nested layouts |
| `renderLastActive` | Single component | Modals, overlays |
| `renderLastExclusiveAndTree` | From boundary | Layout switches |

### 3. Memo and Callback Optimization

```typescript
const Navigation = React.memo(function Navigation() {
  const goTo = useGoTo();
  
  const handleClick = useCallback((to: string) => {
    return goTo(to, { optimistic: true });
  }, [goTo]);
  
  return <nav>...</nav>;
});
```

### 4. Selective Re-rendering

Use route exclusivity to prevent unnecessary re-renders:

```typescript
WithReactComponent(Route)({
  name: 'heavy-component',
  component: HeavyComponent,
  exclusive: true, // Isolates re-renders
});
```

## Testing Patterns and Best Practices

### Hook Testing with React Testing Library

```typescript
import { renderHook } from '@testing-library/react';
import { withContextValue } from './test-utils';

describe('useRouter', () => {
  it('returns router from context', () => {
    const mockRouter = createMockRouter();
    
    const { result } = renderHook(() => useRouter(), {
      wrapper: ({ children }) => 
        withContextValue({ router: mockRouter }, children),
    });
    
    expect(result.current).toBe(mockRouter);
  });
});
```

### Component Testing with Rendering Strategies

```typescript
describe('renderTree', () => {
  it('renders nested components correctly', () => {
    const route1 = WithReactComponent(Route)({
      name: 'parent',
      component: ({ children }) => <div id="parent">{children}</div>,
    });
    
    const route2 = WithReactComponent(Route)({
      name: 'child',
      component: () => <div id="child">Child</div>,
    });
    
    const result = renderTree(router, [route1, route2]);
    const { getByText } = render(result);
    
    expect(getByText('Child')).toBeInTheDocument();
  });
});
```

### Mock Patterns for Testing

```typescript
const createMockRouter = (): RouterInterface => ({
  urlTo: vi.fn(() => "/foo"),
  goTo: vi.fn(),
  history: { 
    emitter: { 
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    },
    pathname: '/',
    push: vi.fn(),
    replace: vi.fn(),
  },
  getMap: vi.fn(() => new Map()),
  activate: vi.fn(),
  active: [],
  on: vi.fn(),
  off: vi.fn(),
});
```

### Integration Testing Patterns

```typescript
describe('Full Router Integration', () => {
  it('handles navigation with lifecycle hooks', async () => {
    const beforeMount = vi.fn();
    const afterMount = vi.fn();
    
    const route = WithReactComponent(Route)({
      name: 'test',
      path: '/test',
      component: TestComponent,
      beforeMount,
      afterMount,
    });
    
    const router = Router({
      history: MemoryHistory(),
      root: route,
    });
    
    await router.init();
    await router.goTo('test');
    
    expect(beforeMount).toHaveBeenCalled();
    expect(afterMount).toHaveBeenCalled();
  });
});
```

## SSR/SSG Support Patterns

### Server-Side Rendering Setup

```typescript
// Server
const router = Router({
  history: MemoryHistory({ pathname: req.url }),
  root: appRoute,
});

await router.init();

const html = ReactDOMServer.renderToString(
  <RoutetouilleProvider router={router}>
    <App />
  </RoutetouilleProvider>
);
```

### Client-Side Hydration

```typescript
// Client
const router = Router({
  history: BrowserHistory(),
  root: appRoute,
});

await router.init();

ReactDOM.hydrateRoot(
  document.getElementById('root'),
  <RoutetouilleProvider router={router}>
    <App />
  </RoutetouilleProvider>
);
```

### Static Generation Support

```typescript
async function generateStaticPaths() {
  const router = Router({ root: appRoute });
  const map = router.getMap();
  
  return Array.from(map.values())
    .filter(route => route.path)
    .map(route => ({
      params: extractParams(route.path),
      path: router.urlTo(route.name),
    }));
}
```

## Advanced Development Patterns

### 1. Custom Rendering Strategies

Create your own rendering strategy:

```typescript
function renderWithTransition<Route extends WithReactComponentInterface>(
  router: RouterInterface,
  active: Route[],
): ReactElement {
  return (
    <TransitionGroup>
      {active.map(route => (
        <CSSTransition key={route.name} timeout={300}>
          {route.component({})}
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
}
```

### 2. Hook Composition for Complex Features

```typescript
function useAuthenticatedRoute() {
  const { active } = useRoute();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const requiresAuth = active.some(route => route.requiresAuth);
    if (requiresAuth && !user) {
      fetchUser().then(setUser);
    }
  }, [active, user]);
  
  return { user, isAuthenticated: !!user };
}
```

### 3. Route Enhancement Composition

```typescript
const EnhancedRoute = compose(
  WithReactComponent,
  WithAnalytics,
  WithErrorBoundary,
  WithSuspense,
)(Route);
```

### 4. Dynamic Route Loading

```typescript
const LazyRoute = WithReactComponent(Route)({
  name: 'lazy',
  path: '/lazy',
  component: React.lazy(() => import('./LazyComponent')),
});
```

## Configuration Files

### TypeScript Configuration
**`tsconfig.json`**: 
- Strict mode enabled for type safety
- ES2024 target with DOM library
- NodeNext module resolution
- Declaration files with source maps
- JSX set to react-jsx

### Biome Configuration  
**`biome.json`**: 
- Strict linting with React rules
- Import extensions enforced
- Unused imports cleanup
- 2-space indentation

### Vitest Configuration
**`vitest.config.ts`**: 
- jsdom environment for React testing
- V8 coverage provider
- React Testing Library setup
- Global test utilities

## Package Dependencies

### Peer Dependencies
- **React 19+**: Latest React with concurrent features
- **routetouille**: Core router functionality
- **React-DOM 19+**: DOM rendering capabilities

### Development Dependencies
- **@testing-library/react**: Component testing
- **@types/react**: TypeScript definitions
- **vitest**: Test runner
- **@biomejs/biome**: Linting and formatting

## Key Files to Understand

**Context and Provider**:
- `src/Context/Context.ts` - React context setup and types
- `src/Context/Provider.tsx` - Context provider component

**Core Hooks**:
- `src/hooks/useRouterRoot.ts` - Primary router integration with state sync
- `src/hooks/useLink.ts` - Advanced link handling with scroll preservation
- `src/hooks/useRoute.ts` - Route state access
- `src/hooks/useGoTo.ts` - Programmatic navigation

**Route Enhancement**:
- `src/Route/WithReactComponent/WithReactComponent.ts` - Component route enhancement
- `src/Route/WithReactRoot/WithReactRoot.ts` - Full React app integration

**Rendering Strategies**:
- `src/strategies/renderTree.ts` - Default hierarchical rendering
- `src/strategies/renderLastExclusiveAndTree.ts` - Boundary-based rendering
- `src/strategies/renderLastActive.ts` - Single component rendering
- `src/strategies/renderRecurse.ts` - Core recursive rendering engine

## Integration Patterns with Core Router

### Router Interface Usage
- Uses `RouterInterface` type from routetouille core
- Event subscription via `on` and `off` methods
- History integration for navigation state
- Type-safe activators and parameters

### Lifecycle Integration
- `afterActivate` events trigger React state updates
- History change events handle scroll restoration
- Mount/unmount lifecycle maps to React component lifecycle
- Error boundaries can catch lifecycle errors

### Navigation Patterns
- Programmatic navigation via `goTo` with type safety
- Declarative navigation via Link components
- URL generation via `urlTo` for href attributes
- State preservation during navigation transitions

## Best Practices and Recommendations

### 1. Choose the Right Rendering Strategy
- Use `renderTree` for standard nested layouts
- Use `renderLastExclusiveAndTree` for layout boundaries
- Use `renderLastActive` for simple single-component routes

### 2. Optimize Re-renders
- Use React.memo for route components
- Leverage exclusive routes to isolate re-renders
- Use useCallback for navigation handlers

### 3. Type Safety
- Always specify generic types for hooks
- Use proper typing for route components
- Leverage TypeScript inference where possible

### 4. Testing
- Test hooks in isolation with renderHook
- Test rendering strategies with different route configurations
- Mock router for unit tests, use real router for integration tests

### 5. Performance
- Enable optimistic navigation for better UX
- Use lazy loading for heavy components
- Implement proper error boundaries