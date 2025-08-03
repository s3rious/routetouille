import { describe, it, expect, vi, beforeEach } from "vitest";
import { createElement } from "react";
import { configureStore } from "@reduxjs/toolkit";
import { WithReduxState } from "./WithReduxState.js";

// Mock useSyncExternalStore to avoid React DOM dependency
vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    useSyncExternalStore: vi.fn((_subscribe, getSnapshot) => {
      // Simulate immediate execution
      return getSnapshot();
    }),
    createElement: vi.fn((component, props, ...children) => {
      // If it's a function component, call it with props
      if (typeof component === "function") {
        return component(props, ...children);
      }
      // Otherwise, return a simple object representation
      return { type: component, props, children };
    }),
  };
});

// Mock Redux store
const createMockStore = () => {
  const store = configureStore({
    reducer: {
      test: (state = { value: 42 }) => state,
    },
  });
  return store;
};

// Mock Route creator
const mockRoute = vi.fn((options) => ({
  name: options.name || "test",
  path: options.path || "/test",
  component: options.component,
  mount: vi.fn(async () => {}),
  unmount: vi.fn(async () => {}),
}));

describe("WithReduxState", () => {
  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    store = createMockStore();
    vi.clearAllMocks();
  });

  describe("Standalone usage (without createRoute)", () => {
    it("should create a standalone route with store and lifecycle methods", () => {
      const standalone = WithReduxState()({
        store,
      });

      expect(standalone).toHaveProperty("store", store);
      expect(standalone).toHaveProperty("mount");
      expect(standalone).toHaveProperty("unmount");
      expect(typeof standalone.mount).toBe("function");
      expect(typeof standalone.unmount).toBe("function");
    });

    it("should execute beforeMount lifecycle with state", async () => {
      const beforeMount = vi.fn();
      const standalone = WithReduxState()({
        store,
        beforeMount,
      });

      await standalone.mount();

      expect(beforeMount).toHaveBeenCalledWith({ state: store.getState() });
    });

    it("should execute afterMount lifecycle with state", async () => {
      const afterMount = vi.fn();
      const standalone = WithReduxState()({
        store,
        afterMount,
      });

      await standalone.mount();

      expect(afterMount).toHaveBeenCalledWith({ state: store.getState() });
    });

    it("should execute beforeUnmount lifecycle with state", async () => {
      const beforeUnmount = vi.fn();
      const standalone = WithReduxState()({
        store,
        beforeUnmount,
      });

      await standalone.unmount();

      expect(beforeUnmount).toHaveBeenCalledWith({ state: store.getState() });
    });

    it("should execute afterUnmount lifecycle with state", async () => {
      const afterUnmount = vi.fn();
      const standalone = WithReduxState()({
        store,
        afterUnmount,
      });

      await standalone.unmount();

      expect(afterUnmount).toHaveBeenCalledWith({ state: store.getState() });
    });
  });

  describe("Composed usage (with createRoute)", () => {
    it("should compose with a createRoute function", () => {
      const _composed = WithReduxState(mockRoute)({
        name: "test",
        path: "/test",
        store,
      });

      expect(mockRoute).toHaveBeenCalled();
      expect(_composed).toHaveProperty("store", store);
      expect(_composed).toHaveProperty("name", "test");
      expect(_composed).toHaveProperty("path", "/test");
    });

    it("should wrap component and provide state as prop", () => {
      const TestComponent = vi.fn(() => createElement("div", null, "test"));
      const _composed = WithReduxState(mockRoute)({
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

      // The wrapped component should have called TestComponent with both original props and state
      expect(TestComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          ...testProps,
          state: store.getState(),
        }),
      );
    });

    it("should set displayName on wrapped component", () => {
      const TestComponent = vi.fn(() => createElement("div", null, "test"));
      TestComponent.displayName = "TestComponent";

      WithReduxState(mockRoute)({
        name: "test",
        component: TestComponent,
        store,
      });

      const mockCallArgs = mockRoute.mock.calls[0][0];
      const WrappedComponent = mockCallArgs.component;
      expect(WrappedComponent.displayName).toBe(
        "WithReduxState(TestComponent)",
      );
    });

    it("should use component name when displayName is not available", () => {
      const TestComponent = vi.fn(() => createElement("div", null, "test"));
      Object.defineProperty(TestComponent, "name", { value: "TestComponent" });

      WithReduxState(mockRoute)({
        name: "test",
        component: TestComponent,
        store,
      });

      const mockCallArgs = mockRoute.mock.calls[0][0];
      const WrappedComponent = mockCallArgs.component;
      expect(WrappedComponent.displayName).toBe(
        "WithReduxState(TestComponent)",
      );
    });

    it("should handle routes without components", () => {
      const _composed = WithReduxState(mockRoute)({
        name: "test",
        path: "/test",
        store,
      });

      expect(mockRoute).toHaveBeenCalledWith({
        name: "test",
        path: "/test",
        store,
      });
      expect(_composed).toHaveProperty("store", store);
    });

    it("should call composed route mount during lifecycle", async () => {
      const composedRoute = {
        mount: vi.fn(async () => {}),
        unmount: vi.fn(async () => {}),
      };
      const mockRouteCreator = vi.fn(() => composedRoute);

      const composed = WithReduxState(mockRouteCreator)({
        name: "test",
        store,
      });

      await composed.mount();

      expect(composedRoute.mount).toHaveBeenCalled();
    });

    it("should call composed route unmount during lifecycle", async () => {
      const composedRoute = {
        mount: vi.fn(async () => {}),
        unmount: vi.fn(async () => {}),
      };
      const mockRouteCreator = vi.fn(() => composedRoute);

      const composed = WithReduxState(mockRouteCreator)({
        name: "test",
        store,
      });

      await composed.unmount();

      expect(composedRoute.unmount).toHaveBeenCalled();
    });

    it("should execute lifecycle methods in correct order for mount", async () => {
      const callOrder: string[] = [];
      const beforeMount = vi.fn(async () => {
        callOrder.push("beforeMount");
      });
      const afterMount = vi.fn(async () => {
        callOrder.push("afterMount");
      });

      const composedRoute = {
        mount: vi.fn(async () => {
          callOrder.push("composedMount");
        }),
        unmount: vi.fn(async () => {}),
      };
      const mockRouteCreator = vi.fn(() => composedRoute);

      const composed = WithReduxState(mockRouteCreator)({
        name: "test",
        store,
        beforeMount,
        afterMount,
      });

      await composed.mount();

      expect(callOrder).toEqual(["beforeMount", "composedMount", "afterMount"]);
    });

    it("should execute lifecycle methods in correct order for unmount", async () => {
      const callOrder: string[] = [];
      const beforeUnmount = vi.fn(async () => {
        callOrder.push("beforeUnmount");
      });
      const afterUnmount = vi.fn(async () => {
        callOrder.push("afterUnmount");
      });

      const composedRoute = {
        mount: vi.fn(async () => {}),
        unmount: vi.fn(async () => {
          callOrder.push("composedUnmount");
        }),
      };
      const mockRouteCreator = vi.fn(() => composedRoute);

      const composed = WithReduxState(mockRouteCreator)({
        name: "test",
        store,
        beforeUnmount,
        afterUnmount,
      });

      await composed.unmount();

      expect(callOrder).toEqual([
        "beforeUnmount",
        "composedUnmount",
        "afterUnmount",
      ]);
    });

    it("should handle composed routes without mount method", async () => {
      const composedRoute = {
        name: "test",
      };
      const mockRouteCreator = vi.fn(() => composedRoute);

      const composed = WithReduxState(mockRouteCreator)({
        name: "test",
        store,
      });

      // Should not throw
      await expect(composed.mount()).resolves.toBeUndefined();
    });

    it("should handle composed routes without unmount method", async () => {
      const composedRoute = {
        name: "test",
      };
      const mockRouteCreator = vi.fn(() => composedRoute);

      const composed = WithReduxState(mockRouteCreator)({
        name: "test",
        store,
      });

      // Should not throw
      await expect(composed.unmount()).resolves.toBeUndefined();
    });
  });

  describe("Error handling", () => {
    it("should handle undefined lifecycle methods gracefully", async () => {
      const standalone = WithReduxState()({
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

      const standalone = WithReduxState()({
        store,
        beforeMount,
      });

      await expect(standalone.mount()).rejects.toThrow(errorMessage);
    });
  });

  describe("Type constraints", () => {
    it("should maintain store reference in composed result", () => {
      const _composed = WithReduxState(mockRoute)({
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

      const composed = WithReduxState(mockRouteCreator)({
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
  });
});
