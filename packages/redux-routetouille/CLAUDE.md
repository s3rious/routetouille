# CLAUDE.md - Redux Routetouille Package

This file provides guidance for working with the Redux bindings package at `/packages/redux-routetouille/`.

## Development Commands

- `npm run format` - Format code using Biome
- `npm run lint` - Lint and auto-fix code using Biome 
- `npm run test` - Run Vitest tests
- `npm run test:coverage` - Run tests with coverage reporting
- `npm run build` - TypeScript compilation to `lib/` directory
- `npm run publish` - Publish to npm with public access

## Package Overview

Redux-Routetouille provides composable Redux state and dispatch integration for Routetouille routes. Built as framework-agnostic wrappers that can be composed with React components or used standalone with any framework.

## Core Architecture

### Composable HOC Pattern

Redux-Routetouille follows the same Higher-Order Component composition pattern as other Routetouille packages:

```typescript
// Single wrapper usage
WithReduxState(WithReactComponent(Route))({
  name: "profile",
  path: "/profile",
  store,
  component: ProfileComponent,
});

// Multiple wrapper composition
WithReduxDispatch(WithReduxState(WithReactComponent(Route)))({
  name: "dashboard", 
  path: "/dashboard",
  store,
  component: DashboardComponent,
});
```

### WithReduxState - State Integration

**Purpose**: Provides Redux state as props to components and lifecycle hooks.

**Key Features**:
- Uses React 18's `useSyncExternalStore` for optimal performance
- Passes current state to component props automatically
- Provides state to lifecycle hooks as object parameters
- Framework-agnostic - works with any component type
- Type-safe with full Redux store typing

**Usage Patterns**:

```typescript
// With React component
const StateRoute = WithReduxState(WithReactComponent(Route))({
  name: "home",
  path: "/",
  store,
  component: HomeComponent, // Receives { state: RootState } props
  beforeMount: async ({ state }) => {
    // Access state in lifecycle hooks
    if (!state.auth.isAuthenticated) {
      await router.goTo("/login");
    }
  },
});

// Standalone usage
const StateHandler = WithReduxState()({
  store,
  beforeMount: async ({ state }) => {
    console.log("Current state:", state);
  },
});
```

**Type Safety**:
```typescript
type WithReduxStateOptions<ReduxStore, ComposedRouteOptions> = 
  WithReduxStateBaseOptions<ReduxStore> & 
  (ComposedRouteOptions extends { component: FunctionComponent<infer ComponentProps> }
    ? Omit<ComposedRouteOptions, 'component'> & {
        component: FunctionComponent<ComponentProps & { state: ReturnType<ReduxStore["getState"]> }>;
      }
    : ComposedRouteOptions);
```

### WithReduxDispatch - Action Dispatch Integration

**Purpose**: Provides Redux dispatch function as props to components and lifecycle hooks.

**Key Features**:
- Direct store.dispatch access without React hooks
- Passes dispatch to component props automatically  
- Provides dispatch to lifecycle hooks as object parameters
- Composable with other wrappers (especially WithReduxState)
- Store passthrough for nested wrapper composition

**Usage Patterns**:

```typescript
// With React component
const DispatchRoute = WithReduxDispatch(WithReactComponent(Route))({
  name: "counter",
  path: "/counter", 
  store,
  component: CounterComponent, // Receives { dispatch } props
  beforeMount: async ({ dispatch }) => {
    // Dispatch actions in lifecycle hooks
    dispatch(loadInitialData());
  },
});

// Composed with state for full Redux integration
const FullReduxRoute = WithReduxDispatch(WithReduxState(WithReactComponent(Route)))({
  name: "app",
  path: "/app",
  store,
  component: AppComponent, // Receives { state, dispatch } props
});
```

**Store Passthrough**:
```typescript
// WithReduxDispatch automatically passes store to inner wrappers
const composed = WithReduxDispatch(WithReduxState(WithReactComponent(Route)))({
  store, // Only specify once at the outer level
  // ... other options
});
```

## Advanced Composition Patterns

### Multi-Wrapper Integration

Redux-Routetouille wrappers are designed to compose seamlessly:

```typescript
// Full stack: Redux + React + Custom behavior
const EnhancedRoute = WithCustomAuth(
  WithReduxDispatch(
    WithReduxState(
      WithReactComponent(Route)
    )
  )
)({
  store,
  component: ProtectedComponent,
  beforeMount: async ({ state, dispatch, authToken }) => {
    // Access state, dispatch, and custom auth token
    if (!state.auth.isAuthenticated) {
      dispatch(redirectToLogin());
    }
  },
});
```

### Lifecycle Hook Object Parameters

Both wrappers use object parameters for lifecycle hooks to enable composition:

```typescript
// Object parameters allow multiple wrappers to contribute
{
  beforeMount: async ({ state, dispatch, customProp }) => {
    // state from WithReduxState
    // dispatch from WithReduxDispatch  
    // customProp from WithCustomWrapper
  }
}
```

### Framework Agnostic Usage

Works with any component system, not just React:

```typescript
// Vue component example
const VueRoute = WithReduxState(WithVueComponent(Route))({
  store,
  component: VueComponent, // Vue component receives state prop
});

// Vanilla JS example  
const VanillaRoute = WithReduxDispatch(Route)({
  store,
  beforeMount: async ({ dispatch }) => {
    // Pure JS logic with Redux dispatch
    dispatch(initializeApp());
  },
});
```

## Implementation Details

### State Subscription Management

**WithReduxState** uses React's `useSyncExternalStore` for efficient subscriptions:

```typescript
const state = useSyncExternalStore(
  store.subscribe,    // Subscribe to store changes
  store.getState,     // Get current state
  store.getState,     // Server-side fallback
);
```

**Benefits**:
- Automatic re-renders on state changes
- Optimal performance with React 18+ concurrent features
- No unnecessary re-renders for unrelated state changes
- Server-side rendering compatibility

### Lifecycle Integration

Both wrappers integrate seamlessly with route lifecycle:

```typescript
// Mount sequence: beforeMount → composed.mount() → afterMount
const methods = [
  beforeMount ? () => beforeMount({ state, dispatch }) : undefined,
  hasMount(composed) ? () => composed.mount() : undefined, 
  afterMount ? () => afterMount({ state, dispatch }) : undefined,
];
```

### Component Wrapping Strategy

**Dynamic component wrapping with display names**:

```typescript
const WrappedComponent = (props) => {
  const state = useSyncExternalStore(store.subscribe, store.getState, store.getState);
  return createElement(UserComponent, { ...props, state });
};

WrappedComponent.displayName = `WithReduxState(${UserComponent.displayName ?? UserComponent.name})`;
```

## Testing Patterns

### Mock Store Creation

```typescript
const createMockStore = () => {
  return configureStore({
    reducer: {
      auth: authSlice.reducer,
      counter: counterSlice.reducer,
    },
  });
};
```

### Component Testing

```typescript
// Test wrapped components receive correct props
const TestComponent = vi.fn(() => createElement("div", null, "test"));
const wrapped = WithReduxState(mockRoute)({
  component: TestComponent,
  store: mockStore,
});

// Verify TestComponent receives state prop
expect(TestComponent).toHaveBeenCalledWith(
  expect.objectContaining({
    state: mockStore.getState(),
  })
);
```

### Lifecycle Testing

```typescript
// Test lifecycle hooks receive correct parameters
const beforeMount = vi.fn();
const route = WithReduxDispatch(WithReduxState(Route))({
  store: mockStore,
  beforeMount,
});

await route.mount();

expect(beforeMount).toHaveBeenCalledWith({
  state: mockStore.getState(),
  dispatch: mockStore.dispatch,
});
```

## Integration Examples

### Basic Redux Integration

```typescript
import { WithReduxState, WithReduxDispatch } from "redux-routetouille";
import { WithReactComponent } from "react-routetouille";
import { Route } from "routetouille";

// Simple state access
const ProfileRoute = WithReduxState(WithReactComponent(Route))({
  name: "profile",
  path: "/profile", 
  store,
  component: ProfileComponent,
});

// State + dispatch access
const DashboardRoute = WithReduxDispatch(WithReduxState(WithReactComponent(Route)))({
  name: "dashboard",
  path: "/dashboard",
  store,
  component: DashboardComponent,
});
```

### Route Guards with Redux

```typescript
const ProtectedRoute = WithReduxState(WithReactComponent(Route))({
  name: "admin",
  path: "/admin",
  store,
  component: AdminComponent,
  beforeMount: async ({ state }) => {
    if (!state.auth.isAuthenticated || !state.auth.isAdmin) {
      await router.goTo("/login");
    }
  },
});
```

### Data Loading Patterns

```typescript  
const DataRoute = WithReduxDispatch(WithReduxState(WithReactComponent(Route)))({
  name: "users",
  path: "/users",
  store,
  component: UsersComponent,
  beforeMount: async ({ state, dispatch }) => {
    if (!state.users.loaded) {
      dispatch(loadUsers());
    }
  },
});
```

## Best Practices

### 1. Composition Order

**Recommended order**: `WithReduxDispatch(WithReduxState(WithReactComponent(Route)))`

- Outer wrappers handle cross-cutting concerns
- Inner wrappers handle specific integrations
- Store passed through automatically

### 2. Store Management

**Single store reference**:
```typescript
// ✅ Good: Single store reference at outer level
WithReduxDispatch(WithReduxState(WithReactComponent(Route)))({
  store,
  // ...
});

// ❌ Avoid: Multiple store references
WithReduxDispatch(WithReduxState(WithReactComponent(Route)))({
  store,
  // store: store, // Redundant - passthrough handles this
});
```

### 3. Lifecycle Hooks

**Use object parameters for composability**:
```typescript
// ✅ Good: Object parameters
beforeMount: async ({ state, dispatch }) => {
  // Multiple wrappers can contribute parameters
}

// ❌ Avoid: Individual parameters  
beforeMount: async (state, dispatch) => {
  // Hard to extend with additional wrappers
}
```

### 4. Type Safety

**Leverage TypeScript inference**:
```typescript
// Types are automatically inferred from store
const route = WithReduxState(WithReactComponent(Route))({
  store: typedStore, // TypeScript infers RootState type
  component: TypedComponent, // Receives { state: RootState } props
});
```

### 5. Performance Optimization

**Component-level subscriptions**:
- Each `WithReduxState` wrapper creates its own subscription
- Components only re-render when accessed state changes
- Use multiple `WithReduxState` wrappers for different state slices if needed

## Error Handling

### Lifecycle Errors

```typescript
// Lifecycle errors propagate up the chain
beforeMount: async ({ state, dispatch }) => {
  try {
    await dispatch(riskyAction()).unwrap();
  } catch (error) {
    // Handle action failures
    dispatch(setError(error.message));
    throw error; // Prevents route mounting
  }
}
```

### Store Access Errors

- Store must be provided to outer wrapper
- Inner wrappers receive store through passthrough
- TypeScript prevents store type mismatches

## Dependencies

### Peer Dependencies
- `@reduxjs/toolkit: ^2.8.0` - Redux store and utilities
- `react: ^19.1.0` - For `useSyncExternalStore` and `createElement`
- `routetouille: file:../routetouille` - Core router functionality

### Development Dependencies
- `vitest` - Testing framework with JSdom environment
- `@biomejs/biome` - Linting and formatting
- `typescript` - Type checking and compilation

## Configuration Files

### TypeScript Configuration
- **Target**: ES2024 with DOM library support
- **Modules**: NodeNext for ES module compatibility
- **Declaration files**: Generated for package consumers
- **Strict mode**: Enabled for type safety

### Biome Configuration
- **Includes**: Only `src/**` files to avoid coverage linting
- **Formatter**: Tab indentation for consistency
- **Linter**: Recommended rules with auto-fix enabled

### Vitest Configuration
- **Environment**: JSdom for React component testing
- **Coverage**: V8 provider with experimental AST remapping
- **Mocking**: React hooks and createElement for isolated testing

This package provides the foundation for Redux integration in Routetouille applications, enabling clean separation of state management and routing concerns while maintaining full composability and type safety.