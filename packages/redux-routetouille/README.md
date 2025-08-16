# Redux-Routetouille

> **Redux binding for Routetouille: seamless Redux state and dispatch integration for any framework.**

---

## What is "Redux-Routetouille"?

**Redux-Routetouille** provides seamless Redux integration for [Routetouille](../routetouille) routes through a composable Higher-Order Component (HOC). Just as Routetouille itself follows a composable pattern, Redux-Routetouille extends this philosophy to Redux state management, allowing you to easily integrate Redux state and dispatch functionality into your route lifecycle and components.

---

<!-- START doctoc -->
<!-- END doctoc -->

---

## Introduction

Redux-Routetouille brings Redux state management to Routetouille applications through a single, powerful wrapper:

- **`WithRedux`**: Provides both Redux state and dispatch to components and lifecycle hooks

This wrapper is framework-agnostic and can be composed with React, Vue, or any other component system.

---

## Why use Redux-Routetouille?

- **🔗 Simple Integration**: One wrapper for complete Redux functionality
- **⚡ Optimal Performance**: Uses React 18's `useSyncExternalStore` for efficient subscriptions
- **🎯 Framework Agnostic**: Works with React, Vue, or vanilla JavaScript components
- **📦 Bundle Size Friendly**: No React-Redux dependency needed
- **🔒 Type Safe**: Full TypeScript support with automatic Redux store typing
- **🪝 Lifecycle Integration**: Access state and dispatch in route lifecycle hooks
- **🧩 Composable**: Seamlessly compose with other Routetouille wrappers

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
import { WithRedux } from 'redux-routetouille';
import { configureStore } from '@reduxjs/toolkit';

// Configure your Redux store
const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    auth: authSlice.reducer,
  },
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

// Create routes with Redux integration
const router = Router({
  history: BrowserHistory(),
  root: Route({
    name: 'app',
    path: '/',
    children: [
      // Route with Redux integration
      WithRedux(WithReactComponent(Route))({
        name: 'dashboard',
        path: 'dashboard/',
        store,
        component: DashboardComponent, // Receives { state, dispatch } props
        beforeMount: async ({ state, dispatch }) => {
          // Check authentication
          if (!state.auth.isAuthenticated) {
            await router.goTo('/login');
          }
          // Initialize data
          dispatch(loadDashboardData());
        },
      }),
    ],
  }),
});
```

### Component Usage

```typescript
// Component receives both state and dispatch
function DashboardComponent({ 
  state, 
  dispatch 
}: {
  state: RootState;
  dispatch: AppDispatch;
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
      <button onClick={() => dispatch(logout())}>
        Logout
      </button>
    </div>
  );
}
```

---

## API Reference

### `WithRedux`

Provides both Redux state and dispatch to components and lifecycle hooks.

#### Usage

```typescript
// With React component
const route = WithRedux(WithReactComponent(Route))({
  name: 'dashboard',
  path: '/dashboard',
  store,
  component: DashboardComponent, // Receives { state, dispatch } props
  beforeMount: async ({ state, dispatch }) => {
    // Access both state and dispatch in lifecycle hooks
    if (!state.auth.isAuthenticated) {
      await router.goTo('/login');
    }
    dispatch(initializeDashboard());
  },
  afterMount: async ({ state, dispatch }) => {
    // Set up subscriptions
    dispatch(subscribeToUpdates());
  },
  beforeUnmount: async ({ state, dispatch }) => {
    // Clean up
    dispatch(unsubscribeFromUpdates());
  },
});

// Standalone usage (without component)
const logicRoute = WithRedux(Route)({
  name: 'background-task',
  path: 'task/',
  store,
  beforeMount: async ({ state, dispatch }) => {
    // Pure logic with state and dispatch access
    const userId = state.auth.user?.id;
    if (userId) {
      await dispatch(startBackgroundTask(userId)).unwrap();
    }
  },
});
```

#### Features

- **Complete Redux integration**: Both state and dispatch in one wrapper
- **Automatic re-renders**: Components re-render when accessed state changes
- **Lifecycle integration**: All lifecycle hooks receive `{ state, dispatch }` parameter
- **Type safety**: Full TypeScript inference from store type
- **Performance optimized**: Uses `useSyncExternalStore` for efficient subscriptions
- **Framework agnostic**: Works with any component system

#### Lifecycle Hook Parameters

All lifecycle hooks (`beforeMount`, `afterMount`, `beforeUnmount`, `afterUnmount`) receive an object with:

```typescript
{
  state: RootState;      // Current Redux state
  dispatch: AppDispatch; // Redux dispatch function
}
```

---

## Advanced Usage

### Route Guards with Redux

```typescript
const ProtectedRoute = WithRedux(WithReactComponent(Route))({
  name: 'admin',
  path: '/admin',
  store,
  component: AdminPanel,
  beforeMount: async ({ state, dispatch }) => {
    const { isAuthenticated, isAdmin } = state.auth;
    
    if (!isAuthenticated) {
      dispatch(setRedirectPath('/admin')); // Store intended destination
      await router.goTo('/login');
      return;
    }
    
    if (!isAdmin) {
      dispatch(logSecurityEvent('unauthorized_admin_access'));
      await router.goTo('/unauthorized');
      return;
    }
    
    // User is authenticated and authorized
    dispatch(loadAdminData());
  },
});
```

### Data Loading Patterns

```typescript
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
    // Set up real-time updates
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
```

### Framework Agnostic Usage

```typescript
// Vue.js integration
const VueRoute = WithRedux(WithVueComponent(Route))({
  store,
  component: VueComponent, // Vue component receives state and dispatch as props
});

// Vanilla JS integration
const VanillaRoute = WithRedux(Route)({
  store,
  beforeMount: async ({ state, dispatch }) => {
    // Pure JavaScript logic
    console.log('Current user:', state.auth.user);
    dispatch(initializeApp());
    updateDOM();
  },
});

// Svelte integration
const SvelteRoute = WithRedux(WithSvelteComponent(Route))({
  store,
  component: SvelteComponent, // Receives both state and dispatch
});
```

### Multiple Store Support

```typescript
// Different routes can use different stores
const MainAppRoute = WithRedux(WithReactComponent(Route))({
  store: mainStore,
  component: MainApp,
});

const AdminRoute = WithRedux(WithReactComponent(Route))({
  store: adminStore, // Different store for admin section
  component: AdminPanel,
});
```

---

## Composition Patterns

### Recommended Composition Order

```typescript
// Standard Redux integration
WithRedux(WithReactComponent(Route))

// With additional wrappers
WithAnalytics(
  WithRedux(
    WithReactComponent(Route)
  )
)
```

### Custom Wrapper Integration

```typescript
// Compose WithRedux with custom wrappers
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
    analytics.track('page-view', { 
      userId: state.auth.user?.id,
      userRole: state.auth.role 
    });
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
    ? WithRedux(BaseRoute)
    : BaseRoute;
    
  return EnhancedRoute({
    ...(needsRedux ? { store } : {}),
    name: 'dynamic-route',
    path: 'dynamic/',
    component: DynamicComponent,
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
WithRedux(WithReactComponent(Route))({
  store, // RootState and AppDispatch types are inferred
  component: ({ state, dispatch }) => {
    // state.user and state.posts are fully typed
    // dispatch is typed with all available actions
    return <div>User: {state.user.name}</div>;
  },
  beforeMount: async ({ state, dispatch }) => {
    // Full type safety in lifecycle hooks
    if (state.user.id) {
      await dispatch(loadUserPosts(state.user.id)).unwrap();
    }
  },
});
```

### Custom Type Definitions

```typescript
// Define custom types for complex scenarios
interface MyRouteProps {
  customProp: string;
}

interface MyComponentProps extends MyRouteProps {
  state: RootState;
  dispatch: AppDispatch;
}

const MyComponent: FunctionComponent<MyComponentProps> = ({ 
  customProp, 
  state, 
  dispatch 
}) => {
  // Component implementation
};

const MyRoute = WithRedux(WithReactComponent(Route))({
  store,
  customProp: 'value',
  component: MyComponent,
});
```

---

## Performance Optimization

### Efficient State Subscriptions

```typescript
// Components only re-render when accessed state changes
const UserRoute = WithRedux(WithReactComponent(Route))({
  store,
  component: ({ state }) => {
    // Only re-renders when user data changes
    const { user } = state.auth;
    return <div>{user?.name}</div>;
  },
});

const CounterRoute = WithRedux(WithReactComponent(Route))({
  store,
  component: ({ state }) => {
    // Only re-renders when counter changes
    const { value } = state.counter;
    return <div>Count: {value}</div>;
  },
});
```

### Selective State Access

```typescript
// Access only the state you need
WithRedux(WithReactComponent(Route))({
  store,
  component: ({ state, dispatch }) => {
    // ✅ Good: Destructure only needed properties
    const { user, isLoading } = state.auth;
    
    return (
      <div>
        {isLoading ? 'Loading...' : `Welcome ${user?.name}`}
        <button onClick={() => dispatch(logout())}>Logout</button>
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
import { WithRedux } from 'redux-routetouille';

describe('Redux integrated routes', () => {
  it('should provide state and dispatch to components', () => {
    const mockStore = configureStore({
      reducer: {
        counter: (state = { value: 42 }) => state,
      },
    });

    const TestComponent = vi.fn(() => createElement('div', null, 'test'));
    
    const route = WithRedux(mockRoute)({
      store: mockStore,
      component: TestComponent,
    });

    // Trigger component render
    const wrappedComponent = route.component;
    wrappedComponent({});

    expect(TestComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        state: { counter: { value: 42 } },
        dispatch: mockStore.dispatch,
      })
    );
  });

  it('should provide state and dispatch to lifecycle hooks', async () => {
    const beforeMount = vi.fn();
    const mockStore = configureStore({
      reducer: { 
        auth: (state = { isAuthenticated: true }) => state 
      },
    });

    const route = WithRedux(mockRoute)({
      store: mockStore,
      beforeMount,
    });

    await route.mount();

    expect(beforeMount).toHaveBeenCalledWith({
      state: { auth: { isAuthenticated: true } },
      dispatch: mockStore.dispatch,
    });
  });
});
```

### Testing Lifecycle Integration

```typescript
it('should handle async lifecycle operations', async () => {
  const mockAction = vi.fn().mockResolvedValue({ type: 'TEST' });
  const mockStore = configureStore({
    reducer: {
      user: (state = { id: 1 }) => state,
    },
  });

  const route = WithRedux(mockRoute)({
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

// After: Using Redux-Routetouille props
function MyComponent({ state, dispatch }) {
  return <div onClick={() => dispatch(action())}>...</div>;
}

// Route configuration
WithRedux(WithReactComponent(Route))({
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
  root: WithRedux(WithReactRoot(ModuleRoute))({
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
// ❌ Wrong: Store not passed
WithRedux(WithReactComponent(Route))({
  // Missing store parameter
  component: MyComponent,
});

// ✅ Correct: Store passed
WithRedux(WithReactComponent(Route))({
  store, // Required
  component: MyComponent,
});
```

**Component not re-rendering on state changes**
```typescript
// ❌ Wrong: Not using WithRedux
WithReactComponent(Route)({
  component: ({ router }) => {
    // Can't access Redux state
    return <div>...</div>;
  },
});

// ✅ Correct: Using WithRedux
WithRedux(WithReactComponent(Route))({
  store,
  component: ({ state, dispatch }) => {
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