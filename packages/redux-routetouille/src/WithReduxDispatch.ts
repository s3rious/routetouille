import type { FunctionComponent, ReactElement } from "react";
import { createElement } from "react";
import type { EnhancedStore } from "@reduxjs/toolkit";

/**
 * Base options for WithReduxDispatch wrapper.
 *
 * @template ReduxStore - The Redux store type extending EnhancedStore
 */
type WithReduxDispatchBaseOptions<ReduxStore extends EnhancedStore> = {
  /** The Redux store instance */
  store: ReduxStore;
  /** Called before route mounting with dispatch function */
  beforeMount?: (params: { dispatch: ReduxStore["dispatch"] }) => Promise<void>;
  /** Called after route mounting with dispatch function */
  afterMount?: (params: { dispatch: ReduxStore["dispatch"] }) => Promise<void>;
  /** Called before route unmounting with dispatch function */
  beforeUnmount?: (params: {
    dispatch: ReduxStore["dispatch"];
  }) => Promise<void>;
  /** Called after route unmounting with dispatch function */
  afterUnmount?: (params: {
    dispatch: ReduxStore["dispatch"];
  }) => Promise<void>;
};

// Combined options type - extends component props with dispatch
type WithReduxDispatchOptions<
  ReduxStore extends EnhancedStore,
  ComposedRouteOptions,
> = WithReduxDispatchBaseOptions<ReduxStore> &
  (ComposedRouteOptions extends {
    component: FunctionComponent<infer ComponentProps>;
  }
    ? Omit<ComposedRouteOptions, "component"> & {
        component: FunctionComponent<
          ComponentProps & { dispatch: ReduxStore["dispatch"] }
        >;
      }
    : ComposedRouteOptions);

// Result interface type
type WithReduxDispatchInterface<
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

// Helper to get lifecycle parameters from composed route
function getComposedLifecycleParams(
  composed: unknown,
  methodName: string,
): Record<string, unknown> {
  if (!composed || typeof composed !== "object") return {};

  // Check if the composed route has a method that can provide parameters
  // biome-ignore lint/suspicious/noExplicitAny: Required for dynamic method access
  const composedAny = composed as any;
  if (
    methodName === "beforeMount" &&
    typeof composedAny._getBeforeMountParams === "function"
  ) {
    return composedAny._getBeforeMountParams();
  }
  if (
    methodName === "afterMount" &&
    typeof composedAny._getAfterMountParams === "function"
  ) {
    return composedAny._getAfterMountParams();
  }
  if (
    methodName === "beforeUnmount" &&
    typeof composedAny._getBeforeUnmountParams === "function"
  ) {
    return composedAny._getBeforeUnmountParams();
  }
  if (
    methodName === "afterUnmount" &&
    typeof composedAny._getAfterUnmountParams === "function"
  ) {
    return composedAny._getAfterUnmountParams();
  }

  return {};
}

// Mount handler factory with parameter extension
function createMountHandler<ReduxStore extends EnhancedStore>(
  store: ReduxStore,
  composed: unknown,
  // biome-ignore lint/suspicious/noExplicitAny: Required for dynamic parameter merging
  beforeMount?: (params: any) => Promise<void>,
  // biome-ignore lint/suspicious/noExplicitAny: Required for dynamic parameter merging
  afterMount?: (params: any) => Promise<void>,
): () => Promise<void> {
  return function mount(): Promise<void> {
    const dispatch = store.dispatch;

    const methods: Array<(() => Promise<void>) | undefined> = [
      beforeMount
        ? async () => {
            // Get parameters from composed route and merge with dispatch
            const composedParams = getComposedLifecycleParams(
              composed,
              "beforeMount",
            );
            await beforeMount({ ...composedParams, dispatch });
          }
        : undefined,
      hasMount(composed) ? () => composed.mount() : undefined,
      afterMount
        ? async () => {
            // Get parameters from composed route and merge with dispatch
            const composedParams = getComposedLifecycleParams(
              composed,
              "afterMount",
            );
            await afterMount({ ...composedParams, dispatch });
          }
        : undefined,
    ];
    return executeLifecycleSequence(methods);
  };
}

// Unmount handler factory with parameter extension
function createUnmountHandler<ReduxStore extends EnhancedStore>(
  store: ReduxStore,
  composed: unknown,
  // biome-ignore lint/suspicious/noExplicitAny: Required for dynamic parameter merging
  beforeUnmount?: (params: any) => Promise<void>,
  // biome-ignore lint/suspicious/noExplicitAny: Required for dynamic parameter merging
  afterUnmount?: (params: any) => Promise<void>,
): () => Promise<void> {
  return function unmount(): Promise<void> {
    const dispatch = store.dispatch;

    const methods: Array<(() => Promise<void>) | undefined> = [
      beforeUnmount
        ? async () => {
            // Get parameters from composed route and merge with dispatch
            const composedParams = getComposedLifecycleParams(
              composed,
              "beforeUnmount",
            );
            await beforeUnmount({ ...composedParams, dispatch });
          }
        : undefined,
      hasUnmount(composed) ? () => composed.unmount() : undefined,
      afterUnmount
        ? async () => {
            // Get parameters from composed route and merge with dispatch
            const composedParams = getComposedLifecycleParams(
              composed,
              "afterUnmount",
            );
            await afterUnmount({ ...composedParams, dispatch });
          }
        : undefined,
    ];
    return executeLifecycleSequence(methods);
  };
}

// Simple overload: without createRoute (standalone)
function WithReduxDispatch<ReduxStore extends EnhancedStore>(): (
  options: WithReduxDispatchBaseOptions<ReduxStore>,
) => {
  store: ReduxStore;
  mount: () => Promise<void>;
  unmount: () => Promise<void>;
};

// Overload: with createRoute
function WithReduxDispatch<
  ReduxStore extends EnhancedStore,
  ComposedRouteOptions,
  ComposedRouteInterface,
>(
  createRoute: (options: ComposedRouteOptions) => ComposedRouteInterface,
): (
  options: WithReduxDispatchOptions<ReduxStore, ComposedRouteOptions>,
) => WithReduxDispatchInterface<ReduxStore, ComposedRouteInterface>;

/**
 * Creates a composable Redux dispatch integration wrapper for Routetouille routes.
 *
 * Provides Redux dispatch function to components as props and to lifecycle hooks as object parameters.
 * Automatically passes the store through to composed inner wrappers for seamless composition.
 *
 * @template ReduxStore - The Redux enhanced store type
 * @template ComposedRouteOptions - Options type from composed route creator
 * @template ComposedRouteInterface - Interface type from composed route creator
 *
 * @param createRoute - Optional route creator function to compose with
 *
 * @returns Function that accepts route options and returns enhanced route with Redux dispatch
 *
 * @example
 * ```typescript
 * // Standalone usage
 * const dispatchHandler = WithReduxDispatch()({
 *   store,
 *   beforeMount: async ({ dispatch }) => {
 *     dispatch(initializeApp());
 *   },
 * });
 *
 * // Composed with React component
 * const route = WithReduxDispatch(WithReactComponent(Route))({
 *   name: 'counter',
 *   path: '/counter',
 *   store,
 *   component: ({ dispatch }) => (
 *     <button onClick={() => dispatch(increment())}>+</button>
 *   ),
 * });
 *
 * // Composed with WithReduxState for full Redux integration
 * const fullRoute = WithReduxDispatch(WithReduxState(WithReactComponent(Route)))({
 *   name: 'dashboard',
 *   path: '/dashboard',
 *   store,
 *   component: ({ state, dispatch }) => (
 *     <div>
 *       <p>Count: {state.counter.value}</p>
 *       <button onClick={() => dispatch(increment())}>+</button>
 *     </div>
 *   ),
 * });
 * ```
 */
function WithReduxDispatch<
  ReduxStore extends EnhancedStore,
  ComposedRouteOptions = never,
  ComposedRouteInterface = never,
>(createRoute?: (options: ComposedRouteOptions) => ComposedRouteInterface) {
  return function withReduxDispatch(
    options: ComposedRouteOptions extends never
      ? WithReduxDispatchBaseOptions<ReduxStore>
      : WithReduxDispatchOptions<ReduxStore, ComposedRouteOptions>,
  ) {
    // Type assertion here is safe because we know the structure from function signature
    const typedOptions =
      options satisfies WithReduxDispatchBaseOptions<ReduxStore> &
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
        _getBeforeMountParams: () => ({ dispatch: store.dispatch }),
        _getAfterMountParams: () => ({ dispatch: store.dispatch }),
        _getBeforeUnmountParams: () => ({ dispatch: store.dispatch }),
        _getAfterUnmountParams: () => ({ dispatch: store.dispatch }),
      };
    }

    // Check for component property with proper type guard
    if (
      "component" in restOptions &&
      typeof restOptions.component === "function"
    ) {
      // Cast is necessary here but safe due to the type guard above
      const UserComponentWithDispatch =
        restOptions.component as FunctionComponent<Record<string, unknown>>;

      // Create a wrapper component that provides the dispatch and matches the expected interface
      const WrappedComponent: FunctionComponent<Record<string, unknown>> = (
        props: Record<string, unknown>,
      ): ReactElement => {
        const dispatch = store.dispatch;
        return createElement(UserComponentWithDispatch, { ...props, dispatch });
      };

      WrappedComponent.displayName = `WithReduxDispatch(${UserComponentWithDispatch.displayName ?? UserComponentWithDispatch.name})`;

      // Create route with wrapped component
      const routeOptions = {
        ...restOptions,
        component: WrappedComponent,
      };

      // Pass store through to composed route
      const routeOptionsWithStore = {
        ...routeOptions,
        store,
      };

      // Type casting is safe here due to our type constraints
      const composed = createRoute(
        routeOptionsWithStore as ComposedRouteOptions,
      );
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
        // Parameter getter methods for composition - merge with composed route's parameters
        _getBeforeMountParams: () => ({
          ...getComposedLifecycleParams(composed, "beforeMount"),
          dispatch: store.dispatch,
        }),
        _getAfterMountParams: () => ({
          ...getComposedLifecycleParams(composed, "afterMount"),
          dispatch: store.dispatch,
        }),
        _getBeforeUnmountParams: () => ({
          ...getComposedLifecycleParams(composed, "beforeUnmount"),
          dispatch: store.dispatch,
        }),
        _getAfterUnmountParams: () => ({
          ...getComposedLifecycleParams(composed, "afterUnmount"),
          dispatch: store.dispatch,
        }),
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
      // Parameter getter methods for composition - merge with composed route's parameters
      _getBeforeMountParams: () => ({
        ...getComposedLifecycleParams(composed, "beforeMount"),
        dispatch: store.dispatch,
      }),
      _getAfterMountParams: () => ({
        ...getComposedLifecycleParams(composed, "afterMount"),
        dispatch: store.dispatch,
      }),
      _getBeforeUnmountParams: () => ({
        ...getComposedLifecycleParams(composed, "beforeUnmount"),
        dispatch: store.dispatch,
      }),
      _getAfterUnmountParams: () => ({
        ...getComposedLifecycleParams(composed, "afterUnmount"),
        dispatch: store.dispatch,
      }),
    };
  };
}

export {
  WithReduxDispatch,
  type WithReduxDispatchOptions,
  type WithReduxDispatchInterface,
  type WithReduxDispatchBaseOptions,
};
