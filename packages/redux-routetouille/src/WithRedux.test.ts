import { describe, it, expect, vi, beforeEach } from "vitest";
import { createElement } from "react";
import { configureStore } from "@reduxjs/toolkit";
import { WithRedux } from "./WithRedux.js";

// Mock createElement to actually call function components
vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    createElement: vi.fn((component, props, ...children) => {
      // If it's a function component, call it with props
      if (typeof component === "function") {
        return component(props, ...children);
      }
      // Otherwise, return a simple object representation
      return { type: component, props, children };
    }),
    useSyncExternalStore: vi.fn((_subscribe, getSnapshot) => {
      // Simulate immediate execution
      return getSnapshot();
    }),
  };
});

// Mock Redux store
const createMockStore = () => {
  const store = configureStore({
    reducer: {
      counter: (state = { value: 42 }) => state,
      auth: (
        state = { user: { id: "1", name: "Test User" }, isAuthenticated: true },
      ) => state,
    },
  });
  return store;
};

// Mock Route creator
const mockRoute = vi.fn((options) => ({
  name: options.name || "test",
  path: options.path || "/test",
  component: options.component,
  store: options.store,
  mount: vi.fn(async () => {}),
  unmount: vi.fn(async () => {}),
}));

describe("WithRedux Integration Tests", () => {
  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    store = createMockStore();
    vi.clearAllMocks();
  });

  describe("Standalone usage (without createRoute)", () => {
    it("should create a standalone route with store and lifecycle methods", () => {
      const standalone = WithRedux()({
        store,
      });

      expect(standalone).toHaveProperty("store", store);
      expect(standalone).toHaveProperty("mount");
      expect(standalone).toHaveProperty("unmount");
      expect(typeof standalone.mount).toBe("function");
      expect(typeof standalone.unmount).toBe("function");
    });

    it("should execute lifecycle methods with both state and dispatch", async () => {
      const beforeMount = vi.fn();
      const afterMount = vi.fn();
      const beforeUnmount = vi.fn();
      const afterUnmount = vi.fn();

      const standalone = WithRedux()({
        store,
        beforeMount,
        afterMount,
        beforeUnmount,
        afterUnmount,
      });

      await standalone.mount();
      await standalone.unmount();

      // Verify beforeMount received both state and dispatch (proper parameter merging)
      expect(beforeMount).toHaveBeenCalledWith({
        state: store.getState(),
        dispatch: store.dispatch,
      });

      // Verify afterMount received both state and dispatch
      expect(afterMount).toHaveBeenCalledWith({
        state: store.getState(),
        dispatch: store.dispatch,
      });

      // Verify beforeUnmount received both state and dispatch
      expect(beforeUnmount).toHaveBeenCalledWith({
        state: store.getState(),
        dispatch: store.dispatch,
      });

      // Verify afterUnmount received both state and dispatch
      expect(afterUnmount).toHaveBeenCalledWith({
        state: store.getState(),
        dispatch: store.dispatch,
      });
    });

    it("should handle undefined lifecycle methods gracefully", async () => {
      const standalone = WithRedux()({
        store,
        beforeMount: undefined,
        afterMount: undefined,
        beforeUnmount: undefined,
        afterUnmount: undefined,
      });

      // Should not throw
      await expect(standalone.mount()).resolves.toBeUndefined();
      await expect(standalone.unmount()).resolves.toBeUndefined();
    });

    it("should handle lifecycle method errors", async () => {
      const errorMessage = "Lifecycle error";
      const beforeMount = vi.fn(async () => {
        throw new Error(errorMessage);
      });

      const standalone = WithRedux()({
        store,
        beforeMount,
      });

      await expect(standalone.mount()).rejects.toThrow(errorMessage);
    });
  });

  describe("Composed usage (with createRoute)", () => {
    it("should compose with a createRoute function", () => {
      const _composed = WithRedux(mockRoute)({
        name: "test",
        path: "/test",
        store,
      });

      expect(mockRoute).toHaveBeenCalled();
      expect(_composed).toHaveProperty("store", store);
      expect(_composed).toHaveProperty("name", "test");
      expect(_composed).toHaveProperty("path", "/test");
    });

    it("should pass store through to composed route", () => {
      WithRedux(mockRoute)({
        name: "test",
        path: "/test",
        store,
      });

      const mockCallArgs = mockRoute.mock.calls[0][0];
      expect(mockCallArgs).toHaveProperty("store", store);
    });

    it("should wrap component and provide both state and dispatch as props", () => {
      const TestComponent = vi.fn(() => createElement("div", null, "test"));
      const _composed = WithRedux(mockRoute)({
        name: "test",
        component: TestComponent,
        store,
      });

      expect(mockRoute).toHaveBeenCalled();
      const mockCallArgs = mockRoute.mock.calls[0][0];
      expect(mockCallArgs).toHaveProperty("component");
      expect(typeof mockCallArgs.component).toBe("function");

      // Test the wrapped component by calling it
      const WrappedComponent = mockCallArgs.component;
      const testProps = { testProp: "value" };

      // Call the wrapped component directly to trigger TestComponent
      const result = WrappedComponent(testProps);
      expect(result).toBeDefined();

      // The wrapped component should have called TestComponent with original props + state + dispatch
      expect(TestComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          ...testProps,
          state: store.getState(),
          dispatch: store.dispatch,
        }),
      );
    });

    it("should set displayName on wrapped component", () => {
      const TestComponent = vi.fn(() => createElement("div", null, "test"));
      TestComponent.displayName = "TestComponent";

      WithRedux(mockRoute)({
        name: "test",
        component: TestComponent,
        store,
      });

      const mockCallArgs = mockRoute.mock.calls[0][0];
      const WrappedComponent = mockCallArgs.component;

      // The actual composition results in WithReduxState wrapping WithReduxDispatch's component
      expect(WrappedComponent.displayName).toBe(
        "WithReduxState(WithReduxDispatch(TestComponent))",
      );
    });

    it("should call composed route lifecycle methods during mount/unmount", async () => {
      const composedRoute = {
        mount: vi.fn(async () => {}),
        unmount: vi.fn(async () => {}),
      };
      const mockRouteCreator = vi.fn(() => composedRoute);

      const composed = WithRedux(mockRouteCreator)({
        name: "test",
        store,
      });

      await composed.mount();
      await composed.unmount();

      expect(composedRoute.mount).toHaveBeenCalled();
      expect(composedRoute.unmount).toHaveBeenCalled();
    });

    it("should execute lifecycle methods in correct order with both state and dispatch", async () => {
      const callOrder: string[] = [];
      const beforeMount = vi.fn(async ({ state, dispatch }) => {
        callOrder.push("beforeMount");
        expect(state).toEqual(store.getState());
        expect(dispatch).toBe(store.dispatch);
      });
      const afterMount = vi.fn(async ({ state, dispatch }) => {
        callOrder.push("afterMount");
        expect(state).toEqual(store.getState());
        expect(dispatch).toBe(store.dispatch);
      });
      const beforeUnmount = vi.fn(async ({ state, dispatch }) => {
        callOrder.push("beforeUnmount");
        expect(state).toEqual(store.getState());
        expect(dispatch).toBe(store.dispatch);
      });
      const afterUnmount = vi.fn(async ({ state, dispatch }) => {
        callOrder.push("afterUnmount");
        expect(state).toEqual(store.getState());
        expect(dispatch).toBe(store.dispatch);
      });

      const composedRoute = {
        mount: vi.fn(async () => {
          callOrder.push("composedMount");
        }),
        unmount: vi.fn(async () => {
          callOrder.push("composedUnmount");
        }),
      };
      const mockRouteCreator = vi.fn(() => composedRoute);

      const composed = WithRedux(mockRouteCreator)({
        name: "test",
        store,
        beforeMount,
        afterMount,
        beforeUnmount,
        afterUnmount,
      });

      await composed.mount();
      await composed.unmount();

      expect(callOrder).toEqual([
        "beforeMount",
        "composedMount",
        "afterMount",
        "beforeUnmount",
        "composedUnmount",
        "afterUnmount",
      ]);
    });

    it("should handle routes without components", () => {
      const _composed = WithRedux(mockRoute)({
        name: "test",
        path: "/test",
        store,
      });

      expect(mockRoute).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "test",
          path: "/test",
          store,
        }),
      );
      expect(_composed).toHaveProperty("store", store);
    });

    it("should handle composed routes without mount/unmount methods", async () => {
      const composedRoute = {
        name: "test",
      };
      const mockRouteCreator = vi.fn(() => composedRoute);

      const composed = WithRedux(mockRouteCreator)({
        name: "test",
        store,
      });

      // Should not throw
      await expect(composed.mount()).resolves.toBeUndefined();
      await expect(composed.unmount()).resolves.toBeUndefined();
    });
  });

  describe("Component Integration", () => {
    it("should provide component with both state and dispatch through composition", () => {
      const TestComponent = vi.fn((props) => {
        // Component should receive both state and dispatch
        expect(props).toHaveProperty("state");
        expect(props).toHaveProperty("dispatch");
        expect(props.state).toBe(store.getState());
        expect(props.dispatch).toBe(store.dispatch);
        return createElement(
          "div",
          null,
          `User: ${props.state.auth.user.name}`,
        );
      });

      const _composed = WithRedux(mockRoute)({
        name: "test",
        component: TestComponent,
        store,
        customProp: "value",
      });

      const mockCallArgs = mockRoute.mock.calls[0][0];
      const WrappedComponent = mockCallArgs.component;

      // Call the wrapped component
      WrappedComponent({ originalProp: "test" });

      expect(TestComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          originalProp: "test",
          state: store.getState(),
          dispatch: store.dispatch,
        }),
      );
    });

    it("should maintain component functionality with realistic Redux actions", () => {
      const TestComponent = vi.fn(({ state, dispatch }) => {
        // Simulate a component that uses both state and dispatch
        const handleIncrement = () => {
          dispatch({ type: "counter/increment" });
        };

        const handleLogout = () => {
          dispatch({ type: "auth/logout" });
        };

        return createElement("div", null, [
          createElement(
            "p",
            { key: "counter" },
            `Count: ${state.counter.value}`,
          ),
          createElement("p", { key: "user" }, `User: ${state.auth.user.name}`),
          createElement(
            "button",
            { key: "inc", type: "button", onClick: handleIncrement },
            "Increment",
          ),
          createElement(
            "button",
            { key: "logout", type: "button", onClick: handleLogout },
            "Logout",
          ),
        ]);
      });

      const _composed = WithRedux(mockRoute)({
        name: "app",
        component: TestComponent,
        store,
      });

      const mockCallArgs = mockRoute.mock.calls[0][0];
      const WrappedComponent = mockCallArgs.component;

      // Call the wrapped component
      WrappedComponent({});

      expect(TestComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          state: store.getState(),
          dispatch: store.dispatch,
        }),
      );
    });
  });

  describe("Store and property passing", () => {
    it("should maintain store reference in composed result", () => {
      const _composed = WithRedux(mockRoute)({
        name: "test",
        store,
      });

      expect(_composed.store).toBe(store);
    });

    it("should spread composed route properties", () => {
      const mockRouteResult = {
        name: "test",
        path: "/test",
        customProperty: "value",
        mount: vi.fn(),
        unmount: vi.fn(),
      };
      const mockRouteCreator = vi.fn(() => mockRouteResult);

      const composed = WithRedux(mockRouteCreator)({
        name: "test",
        store,
      });

      expect(composed).toMatchObject({
        name: "test",
        path: "/test",
        customProperty: "value",
        store,
      });
    });

    it("should pass custom props to composed route while filtering lifecycle props", () => {
      WithRedux(mockRoute)({
        name: "test",
        path: "/test",
        store,
        customProp: "value",
        beforeMount: vi.fn(),
        afterMount: vi.fn(),
      });

      const mockCallArgs = mockRoute.mock.calls[0][0];

      // Should include custom props
      expect(mockCallArgs).toHaveProperty("customProp", "value");
      expect(mockCallArgs).toHaveProperty("store", store);
      expect(mockCallArgs).toHaveProperty("name", "test");
      expect(mockCallArgs).toHaveProperty("path", "/test");

      // Should NOT include lifecycle props (they're handled by the wrapper)
      expect(mockCallArgs).not.toHaveProperty("beforeMount");
      expect(mockCallArgs).not.toHaveProperty("afterMount");
    });
  });

  describe("Type Safety and Edge Cases", () => {
    it("should work with minimal options", () => {
      const _composed = WithRedux(mockRoute)({
        store,
      });

      expect(mockRoute).toHaveBeenCalled();
      expect(_composed).toHaveProperty("store", store);
    });

    it("should handle component name fallback for displayName", () => {
      const TestComponent = vi.fn(() => createElement("div", null, "test"));
      Object.defineProperty(TestComponent, "name", { value: "TestComponent" });

      WithRedux(mockRoute)({
        name: "test",
        component: TestComponent,
        store,
      });

      const mockCallArgs = mockRoute.mock.calls[0][0];
      const WrappedComponent = mockCallArgs.component;
      expect(WrappedComponent.displayName).toBe(
        "WithReduxState(WithReduxDispatch(TestComponent))",
      );
    });
  });

  describe("Composition behavior", () => {
    it("should be equivalent to WithReduxDispatch(WithReduxState(...))", () => {
      // This test verifies that WithRedux is truly a composition of the two wrappers
      const TestComponent = vi.fn(() => createElement("div", null, "test"));

      const _composed = WithRedux(mockRoute)({
        name: "test",
        component: TestComponent,
        store,
        beforeMount: vi.fn(),
      });

      // Should have called mockRoute with the composed wrapper
      expect(mockRoute).toHaveBeenCalled();

      // The result should have the same structure as if we manually composed the wrappers
      expect(_composed).toHaveProperty("store", store);
      expect(_composed).toHaveProperty("name", "test");
      expect(typeof _composed.mount).toBe("function");
      expect(typeof _composed.unmount).toBe("function");
    });
  });
});
