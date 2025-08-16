import type { FunctionComponent, ReactElement } from "react";
import { useSyncExternalStore, createElement } from "react";
import type { EnhancedStore } from "@reduxjs/toolkit";

/**
 * Options for WithRedux wrapper.
 */
type WithReduxOptions<
  ReduxStore extends EnhancedStore,
  ComposedOptions = {},
> = {
  /** The Redux store instance */
  store: ReduxStore;
  /** Called before route mounting with current state and dispatch */
  beforeMount?: (params: {
    state: ReturnType<ReduxStore["getState"]>;
    dispatch: ReduxStore["dispatch"];
  }) => Promise<void>;
  /** Called after route mounting with current state and dispatch */
  afterMount?: (params: {
    state: ReturnType<ReduxStore["getState"]>;
    dispatch: ReduxStore["dispatch"];
  }) => Promise<void>;
  /** Called before route unmounting with current state and dispatch */
  beforeUnmount?: (params: {
    state: ReturnType<ReduxStore["getState"]>;
    dispatch: ReduxStore["dispatch"];
  }) => Promise<void>;
  /** Called after route unmounting with current state and dispatch */
  afterUnmount?: (params: {
    state: ReturnType<ReduxStore["getState"]>;
    dispatch: ReduxStore["dispatch"];
  }) => Promise<void>;
} & (ComposedOptions extends {
  component: FunctionComponent<infer ComponentProps>;
}
  ? Omit<
      ComposedOptions,
      | "component"
      | "beforeMount"
      | "afterMount"
      | "beforeUnmount"
      | "afterUnmount"
    > & {
      component: FunctionComponent<
        ComponentProps & {
          state: ReturnType<ReduxStore["getState"]>;
          dispatch: ReduxStore["dispatch"];
        }
      >;
    }
  : Omit<
      ComposedOptions,
      "beforeMount" | "afterMount" | "beforeUnmount" | "afterUnmount"
    >);

/**
 * Interface provided by WithRedux.
 */
type WithReduxInterface<ReduxStore extends EnhancedStore> = {
  store: ReduxStore;
  mount: () => Promise<void>;
  unmount: () => Promise<void>;
};

// Helper to check if object has mount method
function hasMount(obj: unknown): obj is { mount: () => Promise<void> } {
  return (
    obj !== null &&
    typeof obj === "object" &&
    "mount" in obj &&
    typeof (obj as Record<string, unknown>).mount === "function"
  );
}

// Helper to check if object has unmount method
function hasUnmount(obj: unknown): obj is { unmount: () => Promise<void> } {
  return (
    obj !== null &&
    typeof obj === "object" &&
    "unmount" in obj &&
    typeof (obj as Record<string, unknown>).unmount === "function"
  );
}

/**
 * Creates a composable Redux integration wrapper for Routetouille routes.
 *
 * This wrapper provides both Redux state and dispatch to components and lifecycle hooks.
 * It uses React 18's useSyncExternalStore for optimal performance and automatic re-renders.
 *
 * @example
 * ```typescript
 * const route = WithRedux(WithReactComponent(Route))({
 *   name: 'dashboard',
 *   path: '/dashboard',
 *   store,
 *   component: ({ state, dispatch }) => (
 *     <div>
 *       <p>User: {state.auth.user?.name}</p>
 *       <p>Count: {state.counter.value}</p>
 *       <button onClick={() => dispatch(increment())}>+</button>
 *       <button onClick={() => dispatch(logout())}>Logout</button>
 *     </div>
 *   ),
 *   beforeMount: async ({ state, dispatch }) => {
 *     // Check authentication
 *     if (!state.auth.isAuthenticated) {
 *       await router.goTo('/login');
 *     }
 *     // Initialize data
 *     dispatch(loadDashboardData());
 *   }
 * });
 * ```
 */
function WithRedux<ComposedOptions extends {}, ComposedInterface extends {}>(
  createRoute?: (options: ComposedOptions) => ComposedInterface,
) {
  return <TStore extends EnhancedStore = EnhancedStore>(
    options: WithReduxOptions<TStore, ComposedOptions>,
  ): WithReduxInterface<TStore> & ComposedInterface => {
    const {
      store,
      beforeMount,
      afterMount,
      beforeUnmount,
      afterUnmount,
      ...restOptions
    } = options as WithReduxOptions<TStore, ComposedOptions>;

    // Prepare options for composed route
    let composedOptions: ComposedOptions;

    // Check if there's a component to wrap
    if (
      "component" in restOptions &&
      typeof (restOptions as Record<string, unknown>).component === "function"
    ) {
      const OriginalComponent = (restOptions as Record<string, unknown>)
        .component as FunctionComponent<Record<string, unknown>>;

      // Create wrapped component that provides both state and dispatch
      const WrappedComponent: FunctionComponent<Record<string, unknown>> = (
        props,
      ): ReactElement => {
        // Use React 18's useSyncExternalStore for state subscription
        const state = useSyncExternalStore(
          store.subscribe,
          store.getState,
          store.getState,
        );
        const dispatch = store.dispatch;

        return createElement(OriginalComponent, { ...props, state, dispatch });
      };

      WrappedComponent.displayName = `WithRedux(${
        OriginalComponent.displayName ?? OriginalComponent.name ?? "Component"
      })`;

      // Replace component in options
      composedOptions = {
        ...restOptions,
        component: WrappedComponent,
        store,
      } as unknown as ComposedOptions;
    } else {
      // Pass through options with store
      composedOptions = {
        ...restOptions,
        store,
      } as unknown as ComposedOptions;
    }

    // Create the composed route
    const composed = createRoute
      ? createRoute(composedOptions)
      : ({} as ComposedInterface);

    // Create mount handler with proper this binding
    const mount = async function (
      this: WithReduxInterface<TStore> & ComposedInterface,
    ): Promise<void> {
      const state = store.getState();
      const dispatch = store.dispatch;

      // Execute lifecycle in order
      if (beforeMount) {
        await beforeMount({ state, dispatch });
      }

      if (hasMount(composed)) {
        await composed.mount.call(this);
      }

      if (afterMount) {
        await afterMount({ state, dispatch });
      }
    };

    // Create unmount handler with proper this binding
    const unmount = async function (
      this: WithReduxInterface<TStore> & ComposedInterface,
    ): Promise<void> {
      const state = store.getState();
      const dispatch = store.dispatch;

      // Execute lifecycle in order
      if (beforeUnmount) {
        await beforeUnmount({ state, dispatch });
      }

      if (hasUnmount(composed)) {
        await composed.unmount.call(this);
      }

      if (afterUnmount) {
        await afterUnmount({ state, dispatch });
      }
    };

    // Return the enhanced route
    return {
      ...composed,
      store,
      mount,
      unmount,
    };
  };
}

export { WithRedux, type WithReduxOptions, type WithReduxInterface };
