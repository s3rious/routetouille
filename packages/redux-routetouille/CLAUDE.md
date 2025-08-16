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

Redux-Routetouille provides composable Redux integration for Routetouille routes through a single, powerful wrapper. Built as a framework-agnostic Higher-Order Component that can be composed with React components or used standalone with any framework.

## Core Architecture

### Composable HOC Pattern

Redux-Routetouille follows the same Higher-Order Component composition pattern as other Routetouille packages:

```typescript
// Standard Redux integration
WithRedux(WithReactComponent(Route))({
  name: "dashboard",
  path: "/dashboard",
  store,
  component: DashboardComponent, // Receives { state, dispatch } props
});

// Multiple wrapper composition
WithAnalytics(WithRedux(WithReactComponent(Route)))({
  name: "app", 
  path: "/app",
  store,
  analyticsId: "app-page",
  component: AppComponent,
});
```

### WithRedux - Complete Redux Integration

**Purpose**: Provides both Redux state and dispatch as props to components and lifecycle hooks.

**Key Features**:
- Uses React 18's `useSyncExternalStore` for optimal performance
- Passes current state and dispatch to component props automatically
- Provides state and dispatch to lifecycle hooks as object parameters
- Framework-agnostic - works with any component type
- Type-safe with full Redux store typing
- Single wrapper for complete Redux functionality

**Usage Patterns**:

```typescript
// With React component
const DashboardRoute = WithRedux(WithReactComponent(Route))({
  name: "dashboard",
  path: "/dashboard",
  store,
  component: DashboardComponent, // Receives { state, dispatch } props
  beforeMount: async ({ state, dispatch }) => {
    // Access both state and dispatch in lifecycle hooks
    if (!state.auth.isAuthenticated) {
      await router.goTo("/login");
    }
    dispatch(loadDashboardData());
  },
  afterMount: async ({ state, dispatch }) => {
    dispatch(subscribeToUpdates(state.user.id));
  },
});

// Standalone usage
const LogicRoute = WithRedux()({
  store,
  beforeMount: async ({ state, dispatch }) => {
    console.log("Current state:", state);
    dispatch(initializeApp());
  },
});
```

**Type Safety**:
```typescript
type WithReduxOptions<ReduxStore, ComposedOptions> = {
  store: ReduxStore;
  beforeMount?: (params: {
    state: ReturnType<ReduxStore["getState"]>;
    dispatch: ReduxStore["dispatch"];
  }) => Promise<void>;
  // ... other lifecycle hooks
} & (ComposedOptions extends { component: FunctionComponent<infer ComponentProps> }
  ? Omit<ComposedOptions, 'component' | lifecycle hooks> & {
      component: FunctionComponent<ComponentProps & {
        state: ReturnType<ReduxStore["getState"]>;
        dispatch: ReduxStore["dispatch"];
      }>;
    }
  : Omit<ComposedOptions, lifecycle hooks>);
```

## Advanced Composition Patterns

### Multi-Wrapper Integration

Redux-Routetouille is designed to compose seamlessly with other wrappers:

```typescript
// Full stack: Redux + React + Custom behavior
const EnhancedRoute = WithCustomAuth(
  WithRedux(
    WithReactComponent(Route)
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

WithRedux uses object parameters for lifecycle hooks to enable composition:

```typescript
// Object parameters allow multiple wrappers to contribute
{
  beforeMount: async ({ state, dispatch, customProp }) => {
    // state from WithRedux
    // dispatch from WithRedux  
    // customProp from WithCustomWrapper
  }
}
```

### Framework Agnostic Usage

Works with any component system, not just React:

```typescript
// Vue component example
const VueRoute = WithRedux(WithVueComponent(Route))({
  store,
  component: VueComponent, // Vue component receives state and dispatch props
});

// Vanilla JS example  
const VanillaRoute = WithRedux(Route)({
  store,
  beforeMount: async ({ state, dispatch }) => {
    // Pure JS logic with Redux state and dispatch
    console.log("Current user:", state.auth.user);
    dispatch(initializeApp());
  },
});
```

## Implementation Details

### State Subscription Management

**WithRedux** uses React's `useSyncExternalStore` for efficient subscriptions:

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

WithRedux integrates seamlessly with route lifecycle:

```typescript
// Mount sequence: beforeMount → composed.mount() → afterMount
async mount() {
  if (beforeMount) {
    await beforeMount({ state: store.getState(), dispatch: store.dispatch });
  }
  if (hasMount(composed)) {
    await composed.mount.call(this);
  }
  if (afterMount) {
    await afterMount({ state: store.getState(), dispatch: store.dispatch });
  }
}
```

### Component Wrapping Strategy

**Dynamic component wrapping with display names**:

```typescript
const WrappedComponent = (props) => {
  const state = useSyncExternalStore(store.subscribe, store.getState, store.getState);
  const dispatch = store.dispatch;
  return createElement(UserComponent, { ...props, state, dispatch });
};

WrappedComponent.displayName = `WithRedux(${UserComponent.displayName ?? UserComponent.name})`;
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
const wrapped = WithRedux(mockRoute)({
  component: TestComponent,
  store: mockStore,
});

// Verify TestComponent receives both state and dispatch props
expect(TestComponent).toHaveBeenCalledWith(
  expect.objectContaining({
    state: mockStore.getState(),
    dispatch: mockStore.dispatch,
  })
);
```

### Lifecycle Testing

```typescript
// Test lifecycle hooks receive correct parameters
const beforeMount = vi.fn();
const route = WithRedux(Route)({
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
import { WithRedux } from "redux-routetouille";
import { WithReactComponent } from "react-routetouille";
import { Route } from "routetouille";

// Complete Redux integration
const DashboardRoute = WithRedux(WithReactComponent(Route))({
  name: "dashboard",
  path: "/dashboard",
  store,
  component: DashboardComponent, // Receives { state, dispatch } props
});

// Standalone logic route
const BackgroundTaskRoute = WithRedux(Route)({
  name: "background-task",
  path: "/task",
  store,
  beforeMount: async ({ state, dispatch }) => {
    await dispatch(startBackgroundTask(state.user.id)).unwrap();
  },
});
```

### Route Guards with Redux

```typescript
const ProtectedRoute = WithRedux(WithReactComponent(Route))({
  name: "admin",
  path: "/admin",
  store,
  component: AdminComponent,
  beforeMount: async ({ state, dispatch }) => {
    if (!state.auth.isAuthenticated || !state.auth.isAdmin) {
      dispatch(setRedirectPath("/admin"));
      await router.goTo("/login");
    }
  },
});
```

### Data Loading Patterns

```typescript  
const DataRoute = WithRedux(WithReactComponent(Route))({
  name: "users",
  path: "/users",
  store,
  component: UsersComponent,
  beforeMount: async ({ state, dispatch }) => {
    if (!state.users.loaded) {
      await dispatch(loadUsers()).unwrap();
    }
  },
  afterMount: async ({ state, dispatch }) => {
    dispatch(subscribeToUserUpdates(state.user.id));
  },
  beforeUnmount: async ({ dispatch }) => {
    dispatch(unsubscribeFromUserUpdates());
  },
});
```

## Best Practices

### 1. Composition Order

**Recommended order**: `WithRedux(WithReactComponent(Route))`

- WithRedux provides complete Redux functionality
- Inner wrappers handle specific integrations
- Store only needs to be passed once

### 2. Store Management

**Single store reference**:
```typescript
// ✅ Good: Single store reference
WithRedux(WithReactComponent(Route))({
  store,
  component: MyComponent,
  // ...
});

// ✅ Good: Multiple routes can use different stores
const mainRoute = WithRedux(WithReactComponent(Route))({
  store: mainStore,
  // ...
});

const adminRoute = WithRedux(WithReactComponent(Route))({
  store: adminStore,
  // ...
});
```

### 3. Lifecycle Hooks

**Use object parameters for composability**:
```typescript
// ✅ Good: Object parameters with both state and dispatch
beforeMount: async ({ state, dispatch }) => {
  // Access both state and dispatch
  if (!state.auth.isAuthenticated) {
    dispatch(redirectToLogin());
  }
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
const route = WithRedux(WithReactComponent(Route))({
  store: typedStore, // TypeScript infers RootState and AppDispatch types
  component: TypedComponent, // Receives { state: RootState, dispatch: AppDispatch } props
});
```

### 5. Performance Optimization

**Component-level subscriptions**:
- WithRedux creates subscriptions via `useSyncExternalStore`
- Components only re-render when accessed state changes
- Each component instance gets its own subscription

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