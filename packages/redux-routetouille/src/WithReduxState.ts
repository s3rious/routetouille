import type { FunctionComponent, ReactElement } from "react";
import { useSyncExternalStore, createElement } from "react";
import type { EnhancedStore } from "@reduxjs/toolkit";

/**
 * Base options for WithReduxState wrapper.
 *
 * @template ReduxStore - The Redux store type extending EnhancedStore
 */
type WithReduxStateBaseOptions<ReduxStore extends EnhancedStore> = {
  /** The Redux store instance */
  store: ReduxStore;
  /** Called before route mounting with current state */
  beforeMount?: (params: {
    state: ReturnType<ReduxStore["getState"]>;
  }) => Promise<void>;
  /** Called after route mounting with current state */
  afterMount?: (params: {
    state: ReturnType<ReduxStore["getState"]>;
  }) => Promise<void>;
  /** Called before route unmounting with current state */
  beforeUnmount?: (params: {
    state: ReturnType<ReduxStore["getState"]>;
  }) => Promise<void>;
  /** Called after route unmounting with current state */
  afterUnmount?: (params: {
    state: ReturnType<ReduxStore["getState"]>;
  }) => Promise<void>;
};

// Combined options type - this is the key insight: we need to modify the component type
type WithReduxStateOptions<
  ReduxStore extends EnhancedStore,
  ComposedRouteOptions,
> = WithReduxStateBaseOptions<ReduxStore> &
  (ComposedRouteOptions extends {
    component: FunctionComponent<infer ComponentProps>;
  }
    ? Omit<ComposedRouteOptions, "component"> & {
        component: FunctionComponent<
          ComponentProps & { state: ReturnType<ReduxStore["getState"]> }
        >;
      }
    : ComposedRouteOptions);

// Result interface type
type WithReduxStateInterface<
  ReduxStore extends EnhancedStore,
  ComposedRouteInterface,
> = {
  store: ReduxStore;
} & ComposedRouteInterface;

// Helper to execute lifecycle sequence
function executeLifecycleSequence(
  methods: ReadonlyArray<(() => Promise<void>) | undefined>,
): Promise<void> {
  return methods.reduce(
    (promise, method) =>
      promise.then(() => (method ? method() : Promise.resolve())),
    Promise.resolve(),
  );
}

// Check if an object has a mount method
function hasMount(obj: unknown): obj is { mount: () => Promise<void> } {
  if (typeof obj !== "object" || obj === null || !("mount" in obj)) {
    return false;
  }
  const record = obj as Record<string, unknown>;
  return typeof record.mount === "function";
}

// Check if an object has an unmount method
function hasUnmount(obj: unknown): obj is { unmount: () => Promise<void> } {
  if (typeof obj !== "object" || obj === null || !("unmount" in obj)) {
    return false;
  }
  const record = obj as Record<string, unknown>;
  return typeof record.unmount === "function";
}

// Mount handler factory
function createMountHandler<ReduxStore extends EnhancedStore>(
  store: ReduxStore,
  composed: unknown,
  beforeMount?: (params: {
    state: ReturnType<ReduxStore["getState"]>;
  }) => Promise<void>,
  afterMount?: (params: {
    state: ReturnType<ReduxStore["getState"]>;
  }) => Promise<void>,
): () => Promise<void> {
  return function mount(): Promise<void> {
    const state = store.getState();
    const methods: Array<(() => Promise<void>) | undefined> = [
      beforeMount ? () => beforeMount({ state }) : undefined,
      hasMount(composed) ? () => composed.mount() : undefined,
      afterMount ? () => afterMount({ state }) : undefined,
    ];
    return executeLifecycleSequence(methods);
  };
}

// Unmount handler factory
function createUnmountHandler<ReduxStore extends EnhancedStore>(
  store: ReduxStore,
  composed: unknown,
  beforeUnmount?: (params: {
    state: ReturnType<ReduxStore["getState"]>;
  }) => Promise<void>,
  afterUnmount?: (params: {
    state: ReturnType<ReduxStore["getState"]>;
  }) => Promise<void>,
): () => Promise<void> {
  return function unmount(): Promise<void> {
    const state = store.getState();
    const methods: Array<(() => Promise<void>) | undefined> = [
      beforeUnmount ? () => beforeUnmount({ state }) : undefined,
      hasUnmount(composed) ? () => composed.unmount() : undefined,
      afterUnmount ? () => afterUnmount({ state }) : undefined,
    ];
    return executeLifecycleSequence(methods);
  };
}

// Simple overload: without createRoute (standalone)
function WithReduxState<ReduxStore extends EnhancedStore>(): (
  options: WithReduxStateBaseOptions<ReduxStore>,
) => {
  store: ReduxStore;
  mount: () => Promise<void>;
  unmount: () => Promise<void>;
};

// Overload: with createRoute
function WithReduxState<
  ReduxStore extends EnhancedStore,
  ComposedRouteOptions,
  ComposedRouteInterface,
>(
  createRoute: (options: ComposedRouteOptions) => ComposedRouteInterface,
): (
  options: WithReduxStateOptions<ReduxStore, ComposedRouteOptions>,
) => WithReduxStateInterface<ReduxStore, ComposedRouteInterface>;

/**
 * Creates a composable Redux state integration wrapper for Routetouille routes.
 *
 * Provides Redux state to components as props and to lifecycle hooks as object parameters.
 * Uses React 18's useSyncExternalStore for optimal performance and automatic re-renders.
 *
 * @template ReduxStore - The Redux enhanced store type
 * @template ComposedRouteOptions - Options type from composed route creator
 * @template ComposedRouteInterface - Interface type from composed route creator
 *
 * @param createRoute - Optional route creator function to compose with
 *
 * @returns Function that accepts route options and returns enhanced route with Redux state
 *
 * @example
 * ```typescript
 * // Standalone usage
 * const stateHandler = WithReduxState()({
 *   store,
 *   beforeMount: async ({ state }) => {
 *     console.log('Current user:', state.auth.user);
 *   },
 * });
 *
 * // Composed with React component
 * const route = WithReduxState(WithReactComponent(Route))({
 *   name: 'home',
 *   path: '/',
 *   store,
 *   component: ({ state }) => <div>User: {state.auth.user?.name}</div>,
 * });
 * ```
 */
function WithReduxState<
  ReduxStore extends EnhancedStore,
  ComposedRouteOptions = never,
  ComposedRouteInterface = never,
>(createRoute?: (options: ComposedRouteOptions) => ComposedRouteInterface) {
  return function withReduxState(
    options: ComposedRouteOptions extends never
      ? WithReduxStateBaseOptions<ReduxStore>
      : WithReduxStateOptions<ReduxStore, ComposedRouteOptions>,
  ) {
    // Type assertion here is safe because we know the structure from function signature
    const typedOptions =
      options satisfies WithReduxStateBaseOptions<ReduxStore> &
        Record<string, unknown>;
    const {
      store,
      beforeMount,
      afterMount,
      beforeUnmount,
      afterUnmount,
      ...restOptions
    } = typedOptions;

    // Handle standalone case
    if (!createRoute) {
      const mountStandalone = createMountHandler(
        store,
        null,
        beforeMount,
        afterMount,
      );
      const unmountStandalone = createUnmountHandler(
        store,
        null,
        beforeUnmount,
        afterUnmount,
      );

      return {
        store,
        mount: mountStandalone,
        unmount: unmountStandalone,
        // Parameter getter methods for composition
        _getBeforeMountParams: () => ({ state: store.getState() }),
        _getAfterMountParams: () => ({ state: store.getState() }),
        _getBeforeUnmountParams: () => ({ state: store.getState() }),
        _getAfterUnmountParams: () => ({ state: store.getState() }),
      };
    }

    // Check for component property with proper type guard
    if (
      "component" in restOptions &&
      typeof restOptions.component === "function"
    ) {
      // Cast is necessary here but safe due to the type guard above
      const UserComponentWithState = restOptions.component as FunctionComponent<
        Record<string, unknown>
      >;

      // Create a wrapper component that provides the state and matches the expected interface
      const WrappedComponent: FunctionComponent<Record<string, unknown>> = (
        props: Record<string, unknown>,
      ): ReactElement => {
        const state = useSyncExternalStore(
          store.subscribe,
          store.getState,
          store.getState,
        );
        return createElement(UserComponentWithState, { ...props, state });
      };

      WrappedComponent.displayName = `WithReduxState(${UserComponentWithState.displayName ?? UserComponentWithState.name})`;

      // Create route with wrapped component - pass store through to composed route
      const routeOptions = {
        ...restOptions,
        component: WrappedComponent,
        store,
      };

      // Type casting is safe here due to our type constraints
      const composed = createRoute(routeOptions as ComposedRouteOptions);
      const mountWithComponent = createMountHandler(
        store,
        composed,
        beforeMount,
        afterMount,
      );
      const unmountWithComponent = createUnmountHandler(
        store,
        composed,
        beforeUnmount,
        afterUnmount,
      );

      return {
        ...composed,
        store,
        mount: mountWithComponent,
        unmount: unmountWithComponent,
        // Parameter getter methods for composition
        _getBeforeMountParams: () => ({ state: store.getState() }),
        _getAfterMountParams: () => ({ state: store.getState() }),
        _getBeforeUnmountParams: () => ({ state: store.getState() }),
        _getAfterUnmountParams: () => ({ state: store.getState() }),
      };
    }

    // Handle case without component - pass store through to composed route
    const restOptionsWithStore = {
      ...restOptions,
      store,
    };

    // Type casting is safe due to our type constraints
    const composed = createRoute(restOptionsWithStore as ComposedRouteOptions);
    const mountWithoutComponent = createMountHandler(
      store,
      composed,
      beforeMount,
      afterMount,
    );
    const unmountWithoutComponent = createUnmountHandler(
      store,
      composed,
      beforeUnmount,
      afterUnmount,
    );

    return {
      ...composed,
      store,
      mount: mountWithoutComponent,
      unmount: unmountWithoutComponent,
      // Parameter getter methods for composition
      _getBeforeMountParams: () => ({ state: store.getState() }),
      _getAfterMountParams: () => ({ state: store.getState() }),
      _getBeforeUnmountParams: () => ({ state: store.getState() }),
      _getAfterUnmountParams: () => ({ state: store.getState() }),
    };
  };
}

export {
  WithReduxState,
  type WithReduxStateOptions,
  type WithReduxStateInterface,
  type WithReduxStateBaseOptions,
};
