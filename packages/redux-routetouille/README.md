# Redux-Routetouille

> **Redux bindings for Routetouille: composable Redux state and dispatch integration for any framework.**

---

## What is "Redux-Routetouille"?

**Redux-Routetouille** provides seamless Redux integration for [Routetouille](../routetouille) routes through composable Higher-Order Components (HOCs). Just as Routetouille itself follows a composable pattern, Redux-Routetouille extends this philosophy to Redux state management, allowing you to easily integrate Redux state and dispatch functionality into your route lifecycle and components.

---

<!-- START doctoc -->
<!-- END doctoc -->

---

## Introduction

Redux-Routetouille brings Redux state management to Routetouille applications through composable wrappers:

- **`WithRedux`**: Provides both Redux state and dispatch (recommended for most use cases)
- **`WithReduxState`**: Provides Redux state to components and lifecycle hooks
- **`WithReduxDispatch`**: Provides Redux dispatch function to components and lifecycle hooks

These wrappers are framework-agnostic and can be composed with React, Vue, or any other component system.

---

## Why use Redux-Routetouille?

- **🔗 Composable Integration**: Seamlessly compose with other Routetouille wrappers
- **⚡ Optimal Performance**: Uses React 18's `useSyncExternalStore` for efficient subscriptions
- **🎯 Framework Agnostic**: Works with React, Vue, or vanilla JavaScript components
- **📦 Bundle Size Friendly**: No React-Redux dependency needed
- **🔒 Type Safe**: Full TypeScript support with Redux store typing
- **🪝 Lifecycle Integration**: Access state and dispatch in route lifecycle hooks
- **🧩 Composable**: Use together or separately based on your needs

---

## Installation

```sh
npm install redux-routetouille @reduxjs/toolkit routetouille
# or
yarn add redux-routetouille @reduxjs/toolkit routetouille
```

### Peer Dependencies

- `@reduxjs/toolkit: ^2.8.0` - Redux store and utilities
- `react: ^19.1.0` - For `useSyncExternalStore` and `createElement`
- `routetouille: ^1.0.0` - Core router functionality

---

## Quick Start

### Basic Setup with React

```typescript
import { Router, Route, BrowserHistory } from 'routetouille';
import { WithReactComponent } from 'react-routetouille';
import { WithRedux, WithReduxState } from 'redux-routetouille';
import { configureStore } from '@reduxjs/toolkit';

// Configure your Redux store
const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    auth: authSlice.reducer,
  },
});

type RootState = ReturnType<typeof store.getState>;

// Create routes with Redux integration
const router = Router({
  history: BrowserHistory(),
  root: Route({
    name: 'app',
    path: '/',
    children: [
      // Route with both state and dispatch (recommended)
      WithRedux(WithReactComponent(Route))({
        name: 'dashboard',
        path: 'dashboard/',
        store,
        component: DashboardComponent, // Receives { state, dispatch } props
      }),
      
      // Route with only state (when dispatch not needed)
      WithReduxState(WithReactComponent(Route))({
        name: 'profile',
        path: 'profile/',
        store,
        component: ProfileComponent, // Receives { state } props
        beforeMount: async ({ state }) => {
          if (!state.auth.isAuthenticated) {
            await router.goTo('/login');
          }
        },
      }),
    ],
  }),
});
```

### Component Usage

```typescript
// Dashboard component receives both state and dispatch
function DashboardComponent({ 
  state, 
  dispatch 
}: {
  state: RootState;
  dispatch: typeof store.dispatch;
}) {
  const { counter, auth } = state;
  
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Count: {counter.value}</p>
      <p>User: {auth.user?.name}</p>
      <button onClick={() => dispatch(incrementCounter())}>
        Increment
      </button>
    </div>
  );
}
```

---

## API Reference

### `WithReduxState`

Provides Redux state to components and lifecycle hooks.

#### Usage

```typescript
// With React component
WithReduxState(WithReactComponent(Route))({
  name: 'home',
  path: '/',
  store,
  component: HomeComponent, // Receives { state: RootState } props
  beforeMount: async ({ state }) => {
    // Access current state in lifecycle
    console.log('Current user:', state.auth.user);
  },
});

// Standalone usage
WithReduxState()({
  store,
  beforeMount: async ({ state }) => {
    // Pure logic with state access
    analytics.track('route-visit', { userId: state.auth.user?.id });
  },
});
```

#### Features

- **Automatic re-renders**: Components re-render when accessed state changes
- **Lifecycle integration**: All lifecycle hooks receive `{ state }` parameter
- **Type safety**: Full TypeScript inference from store type
- **Performance optimized**: Uses `useSyncExternalStore` for efficient subscriptions

### `WithRedux`

Convenience wrapper that provides both Redux state and dispatch functionality. This is the recommended approach for most use cases as it combines `WithReduxState` and `WithReduxDispatch` in a single wrapper.

#### Usage

```typescript
// Simplified Redux integration
const route = WithRedux(WithReactComponent(Route))({
  name: 'dashboard',
  path: '/dashboard',
  store,
  component: DashboardComponent, // Receives { state, dispatch } props
  beforeMount: async ({ state, dispatch }) => {
    // Access both state and dispatch in lifecycle hooks
    if (!state.auth.isAuthenticated) {
      await dispatch(redirectToLogin());
    }
  },
});

// Equivalent to manual composition but cleaner
// WithRedux(Route) === WithReduxDispatch(WithReduxState(Route))
const manualRoute = WithReduxDispatch(WithReduxState(WithReactComponent(Route)))({
  // Same options as above
});
```

#### Features

- **Complete Redux integration**: Both state and dispatch in one wrapper
- **Simplified syntax**: Single wrapper instead of manual composition
- **Automatic parameter merging**: Lifecycle hooks receive `{ state, dispatch }`
- **Type safety**: Full TypeScript inference for both state and dispatch
- **Performance optimized**: Uses efficient subscription patterns from both wrappers

#### Component Example

```typescript
function DashboardComponent({ 
  state, 
  dispatch 
}: {
  state: RootState;
  dispatch: typeof store.dispatch;
}) {
  const { user, counter } = state;
  
  return (
    <div>
      <h1>Welcome {user.name}</h1>
      <p>Count: {counter.value}</p>
      <button onClick={() => dispatch(incrementCounter())}>
        Increment
      </button>
      <button onClick={() => dispatch(logout())}>
        Logout
      </button>
    </div>
  );
}
```

### `WithReduxDispatch`

Provides Redux dispatch function to components and lifecycle hooks.

#### Usage

```typescript
// With React component
WithReduxDispatch(WithReactComponent(Route))({
  name: 'counter',
  path: '/counter',
  store,
  component: CounterComponent, // Receives { dispatch } props
  beforeMount: async ({ dispatch }) => {
    // Dispatch actions in lifecycle
    dispatch(loadInitialData());
  },
});

// Composed with WithReduxState for full Redux access
WithReduxDispatch(WithReduxState(WithReactComponent(Route)))({
  name: 'app',
  path: '/app',
  store,
  component: AppComponent, // Receives { state, dispatch } props
});
```

#### Features

- **Direct dispatch**: Access to `store.dispatch` without hooks
- **Lifecycle integration**: All lifecycle hooks receive `{ dispatch }` parameter
- **Composable**: Automatically passes store through to inner wrappers
- **Framework agnostic**: Works with any component system

---

## Advanced Usage

### Route Guards with Redux

```typescript
// Using WithRedux for complete integration
const ProtectedRoute = WithRedux(WithReactComponent(Route))({
  name: 'admin',
  path: '/admin',
  store,
  component: AdminPanel,
  beforeMount: async ({ state, dispatch }) => {
    const { isAuthenticated, isAdmin } = state.auth;
    
    if (!isAuthenticated) {
      dispatch(setRedirectPath('/admin')); // Store redirect path
      await router.goTo('/login');
      return;
    }
    
    if (!isAdmin) {
      dispatch(logSecurityEvent('unauthorized_admin_access'));
      await router.goTo('/unauthorized');
      return;
    }
  },
});

// Using individual wrappers (equivalent but more verbose)
const VerboseProtectedRoute = WithReduxState(WithReactComponent(Route))({
  name: 'admin',
  path: '/admin',
  store,
  component: AdminPanel,
  beforeMount: async ({ state }) => {
    const { isAuthenticated, isAdmin } = state.auth;
    
    if (!isAuthenticated) {
      await router.goTo('/login');
      return;
    }
    
    if (!isAdmin) {
      await router.goTo('/unauthorized');
      return;
    }
  },
});
```

### Data Loading Patterns

```typescript
// Using WithRedux for streamlined data loading
const DataRoute = WithRedux(WithReactComponent(Route))({
  name: 'users',
  path: '/users',
  store,
  component: UsersList,
  beforeMount: async ({ state, dispatch }) => {
    // Check if data is already loaded
    if (!state.users.loaded && !state.users.loading) {
      // Dispatch loading action
      await dispatch(loadUsers()).unwrap();
    }
  },
  afterMount: async ({ state, dispatch }) => {
    // Set up real-time updates with user context
    dispatch(subscribeToUserUpdates({
      userId: state.auth.user?.id,
      preferences: state.user.preferences,
    }));
  },
  beforeUnmount: async ({ dispatch }) => {
    // Clean up subscriptions
    dispatch(unsubscribeFromUserUpdates());
  },
});

// Equivalent verbose composition
const VerboseDataRoute = WithReduxDispatch(WithReduxState(WithReactComponent(Route)))({
  name: 'users',
  path: '/users',
  store,
  component: UsersList,
  beforeMount: async ({ state, dispatch }) => {
    if (!state.users.loaded && !state.users.loading) {
      await dispatch(loadUsers()).unwrap();
    }
  },
  afterMount: async ({ dispatch }) => {
    dispatch(subscribeToUserUpdates());
  },
  beforeUnmount: async ({ dispatch }) => {
    dispatch(unsubscribeFromUserUpdates());
  },
});
```

### Framework Agnostic Usage

```typescript
// Vue.js integration
const VueRoute = WithReduxState(WithVueComponent(Route))({
  store,
  component: VueComponent, // Vue component receives state as prop
});

// Vanilla JS integration
const VanillaRoute = WithReduxDispatch(Route)({
  store,
  beforeMount: async ({ dispatch }) => {
    // Pure JavaScript logic
    dispatch(initializeApp());
    updateDOM();
  },
});

// Svelte integration
const SvelteRoute = WithReduxDispatch(WithReduxState(WithSvelteComponent(Route)))({
  store,
  component: SvelteComponent, // Receives both state and dispatch
});
```

### Multiple Store Support

```typescript
// Different routes can use different stores
const MainAppRoute = WithReduxState(WithReactComponent(Route))({
  store: mainStore,
  component: MainApp,
});

const AdminRoute = WithReduxState(WithReactComponent(Route))({
  store: adminStore,
  component: AdminPanel,
});
```

---

## Composition Patterns

### Recommended Composition Order

```typescript
// Most recommended: Use WithRedux convenience wrapper
WithRedux(WithReactComponent(Route))

// ✅ Benefits:
// - Single wrapper for complete Redux integration
// - Simplified syntax and imports
// - Both state and dispatch automatically available
// - Equivalent to manual composition

// Alternative: Manual composition (more verbose but equivalent)
WithReduxDispatch(WithReduxState(WithReactComponent(Route)))

// ✅ Benefits of manual composition:
// - Explicit about which wrappers are used
// - Fine-grained control over composition order
// - Single store reference needed
// - Automatic store passthrough
```

### Custom Wrapper Integration

```typescript
// Compose WithRedux with custom wrappers (recommended)
const EnhancedRoute = WithAnalytics(
  WithRedux(
    WithReactComponent(Route)
  )
)({
  store,
  analyticsId: 'dashboard-page',
  component: DashboardComponent,
  beforeMount: async ({ state, dispatch, analytics }) => {
    // Access state, dispatch, and custom analytics
    analytics.track('page-view', { userId: state.auth.user?.id });
    await dispatch(loadDashboardData()).unwrap();
  },
});

// Equivalent manual composition (more verbose)
const ManualEnhancedRoute = WithAnalytics(
  WithReduxDispatch(
    WithReduxState(
      WithReactComponent(Route)
    )
  )
)({
  store,
  analyticsId: 'dashboard-page',
  component: DashboardComponent,
  beforeMount: async ({ state, dispatch, analytics }) => {
    analytics.track('page-view', { userId: state.auth.user?.id });
    await dispatch(loadDashboardData()).unwrap();
  },
});
```

### Conditional Composition

```typescript
// Conditionally apply Redux integration
function createRoute(needsRedux: boolean) {
  const BaseRoute = WithReactComponent(Route);
  const EnhancedRoute = needsRedux 
    ? WithReduxState(BaseRoute)
    : BaseRoute;
    
  return EnhancedRoute({
    // ... route options
  });
}
```

---

## TypeScript Integration

### Automatic Type Inference

```typescript
// Types are automatically inferred from your store
const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    posts: postsSlice.reducer,
  },
});

// TypeScript automatically knows the state shape
WithReduxState(WithReactComponent(Route))({
  store, // RootState type is inferred
  component: ({ state }) => {
    // state.user and state.posts are fully typed
    return <div>User: {state.user.name}</div>;
  },
});
```

### Custom Type Definitions

```typescript
// Define custom types for complex scenarios
interface MyRouteProps {
  customProp: string;
}

interface MyComponent extends FunctionComponent<MyRouteProps & {
  state: RootState;
  dispatch: AppDispatch;
}> {}

const MyRoute = WithReduxDispatch(WithReduxState(WithReactComponent(Route)))({
  store,
  customProp: 'value',
  component: MyComponent,
});
```

---

## Performance Optimization

### Efficient State Subscriptions

```typescript
// Each WithReduxState wrapper creates its own subscription
// Components only re-render when accessed state changes

// ✅ Good: Multiple specific subscriptions
const UserRoute = WithReduxState(WithReactComponent(Route))({
  store,
  component: ({ state }) => <div>{state.user.name}</div>, // Only re-renders on user changes
});

const PostsRoute = WithReduxState(WithReactComponent(Route))({
  store,
  component: ({ state }) => <div>{state.posts.length}</div>, // Only re-renders on posts changes
});
```

### Selective State Access

```typescript
// Access only the state you need
WithReduxState(WithReactComponent(Route))({
  store,
  component: ({ state }) => {
    // ✅ Good: Destructure only needed properties
    const { user, isLoading } = state.auth;
    
    return (
      <div>
        {isLoading ? 'Loading...' : `Welcome ${user?.name}`}
      </div>
    );
  },
});
```

---

## Testing

### Testing Components with Redux Integration

```typescript
import { describe, it, expect, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { WithReduxState } from 'redux-routetouille';

describe('Redux integrated routes', () => {
  it('should provide state to components', () => {
    const mockStore = configureStore({
      reducer: {
        counter: (state = { value: 42 }) => state,
      },
    });

    const TestComponent = vi.fn(() => createElement('div', null, 'test'));
    
    const route = WithReduxState(mockRoute)({
      store: mockStore,
      component: TestComponent,
    });

    // Trigger component render
    const wrappedComponent = route.component;
    wrappedComponent({});

    expect(TestComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        state: { counter: { value: 42 } },
      })
    );
  });

  it('should provide dispatch to lifecycle hooks', async () => {
    const beforeMount = vi.fn();
    const mockStore = configureStore({
      reducer: { test: (state = {}) => state },
    });

    const route = WithReduxDispatch(mockRoute)({
      store: mockStore,
      beforeMount,
    });

    await route.mount();

    expect(beforeMount).toHaveBeenCalledWith({
      dispatch: mockStore.dispatch,
    });
  });
});
```

### Testing Lifecycle Integration

```typescript
it('should handle async lifecycle operations', async () => {
  const mockAction = vi.fn().mockResolvedValue({ type: 'TEST' });
  const mockStore = {
    dispatch: vi.fn().mockResolvedValue(mockAction()),
    getState: vi.fn().mockReturnValue({ user: { id: 1 } }),
    subscribe: vi.fn(),
  };

  const route = WithReduxDispatch(WithReduxState(mockRoute))({
    store: mockStore,
    beforeMount: async ({ state, dispatch }) => {
      await dispatch(loadUserData(state.user.id));
    },
  });

  await route.mount();

  expect(mockStore.dispatch).toHaveBeenCalled();
});
```

---

## Migration Guide

### From React-Redux

```typescript
// Before: Using React-Redux hooks
function MyComponent() {
  const state = useSelector(state => state);
  const dispatch = useDispatch();
  
  return <div onClick={() => dispatch(action())}>...</div>;
}

// After: Using Redux-Routetouille props (recommended)
function MyComponent({ state, dispatch }) {
  return <div onClick={() => dispatch(action())}>...</div>;
}

// Route configuration with WithRedux (simplest)
WithRedux(WithReactComponent(Route))({
  store,
  component: MyComponent,
});

// Alternative: Manual composition (equivalent but more verbose)
WithReduxDispatch(WithReduxState(WithReactComponent(Route)))({
  store,
  component: MyComponent,
});
```

### From Context-Based Redux

```typescript
// Before: Manual context setup
const ReduxContext = createContext();

function App() {
  return (
    <ReduxContext.Provider value={store}>
      <Routes />
    </ReduxContext.Provider>
  );
}

// After: Direct integration with routes
const router = Router({
  root: WithReduxState(WithReactRoot(ModuleRoute))({
    store,
    component: App,
    children: [
      // Routes automatically have access to Redux
    ],
  }),
});
```

---

## Troubleshooting

### Common Issues

**Store not available in lifecycle hooks**
```typescript
// ❌ Wrong: Store not passed to outer wrapper
WithReduxDispatch(WithReduxState(WithReactComponent(Route)))({
  // Missing store parameter
  component: MyComponent,
});

// ✅ Correct: Store passed to outer wrapper
WithReduxDispatch(WithReduxState(WithReactComponent(Route)))({
  store, // Store is passed through automatically
  component: MyComponent,
});
```

**Component not re-rendering on state changes**
```typescript
// ❌ Wrong: Not using WithReduxState
WithReactComponent(Route)({
  component: ({ router }) => {
    // Can't access Redux state
    return <div>...</div>;
  },
});

// ✅ Correct: Using WithReduxState
WithReduxState(WithReactComponent(Route))({
  store,
  component: ({ state }) => {
    // Automatically re-renders on state changes
    return <div>{state.user.name}</div>;
  },
});
```

**TypeScript errors with component props**
```typescript
// ❌ Wrong: Not including Redux props in component type
interface Props {
  customProp: string;
}

function MyComponent({ customProp }: Props) {
  // TypeScript error: state and dispatch not in Props
}

// ✅ Correct: Including Redux props
interface Props {
  customProp: string;
  state: RootState;
  dispatch: AppDispatch;
}

function MyComponent({ customProp, state, dispatch }: Props) {
  // All props properly typed
}
```

---

## Related Resources

- [Routetouille Core](../routetouille) — Core router documentation
- [React Routetouille](../react-routetouille) — React-specific bindings
- [React Example](../../examples/react) — Complete React + Redux integration example
- [Redux Toolkit](https://redux-toolkit.js.org/) — Modern Redux development

---

## Contributing

For contribution guidelines, see [CONTRIBUTING.md](../../CONTRIBUTING.md) in the repository root.

---

## License

MIT — see [LICENSE](./LICENSE) for details.