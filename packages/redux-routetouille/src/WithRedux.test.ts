import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { createElement } from "react";
import { WithRedux } from "./WithRedux.js";

// Mock React's useSyncExternalStore
vi.mock("react", () => ({
  useSyncExternalStore: vi.fn((_subscribe, getSnapshot) => getSnapshot()),
  createElement: vi.fn((type, props, ...children) => ({
    type,
    props,
    children,
  })),
}));

describe("WithRedux", () => {
  let mockStore: ReturnType<typeof configureStore>;
  let mockRoute: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Create a mock Redux store
    const counterSlice = createSlice({
      name: "counter",
      initialState: { value: 0 },
      reducers: {
        increment: (state) => {
          state.value += 1;
        },
        decrement: (state) => {
          state.value -= 1;
        },
      },
    });

    mockStore = configureStore({
      reducer: {
        counter: counterSlice.reducer,
        auth: (state = { isAuthenticated: false }) => state,
      },
    });

    // Create a mock route creator
    mockRoute = vi.fn((options) => ({
      ...options,
      mount: vi.fn(),
      unmount: vi.fn(),
    }));
  });

  describe("Basic functionality", () => {
    it("should create a wrapper function", () => {
      const wrapper = WithRedux(mockRoute);
      expect(typeof wrapper).toBe("function");
    });

    it("should pass store to the route", () => {
      const wrapper = WithRedux(mockRoute);
      const route = wrapper({
        name: "test",
        path: "test/",
        store: mockStore,
      });

      expect(route.store).toBe(mockStore);
    });

    it("should call the composed route creator", () => {
      const wrapper = WithRedux(mockRoute);
      wrapper({
        name: "test",
        path: "test/",
        store: mockStore,
      });

      expect(mockRoute).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "test",
          path: "test/",
          store: mockStore,
        }),
      );
    });
  });

  describe("Component wrapping", () => {
    it("should wrap component to provide state and dispatch", () => {
      const TestComponent = vi.fn(() => createElement("div", null, "test"));
      const wrapper = WithRedux(mockRoute);

      wrapper({
        name: "test",
        path: "test/",
        store: mockStore,
        component: TestComponent,
      });

      // Get the wrapped component from the mock call
      const wrappedOptions = mockRoute.mock.calls[0][0];
      const WrappedComponent = wrappedOptions.component;

      // Test that it's a function (React component)
      expect(typeof WrappedComponent).toBe("function");

      // Call the wrapped component
      const testProps = { id: "test" };
      WrappedComponent(testProps);

      // Verify createElement was called with original component
      expect(createElement).toHaveBeenCalledWith(
        TestComponent,
        expect.objectContaining({
          id: "test",
          state: mockStore.getState(),
          dispatch: mockStore.dispatch,
        }),
      );
    });

    it("should set display name for wrapped component", () => {
      const TestComponent = vi.fn(() => null);
      TestComponent.displayName = "TestComponent";

      const wrapper = WithRedux(mockRoute);
      wrapper({
        name: "test",
        path: "test/",
        store: mockStore,
        component: TestComponent,
      });

      const wrappedOptions = mockRoute.mock.calls[0][0];
      expect(wrappedOptions.component.displayName).toBe(
        "WithRedux(TestComponent)",
      );
    });
  });

  describe("Lifecycle hooks", () => {
    it("should call beforeMount with state and dispatch", async () => {
      const beforeMount = vi.fn();
      const wrapper = WithRedux(mockRoute);

      const route = wrapper({
        name: "test",
        path: "test/",
        store: mockStore,
        beforeMount,
      });

      await route.mount();

      expect(beforeMount).toHaveBeenCalledWith({
        state: mockStore.getState(),
        dispatch: mockStore.dispatch,
      });
    });

    it("should call afterMount with state and dispatch", async () => {
      const afterMount = vi.fn();
      const wrapper = WithRedux(mockRoute);

      const route = wrapper({
        name: "test",
        path: "test/",
        store: mockStore,
        afterMount,
      });

      await route.mount();

      expect(afterMount).toHaveBeenCalledWith({
        state: mockStore.getState(),
        dispatch: mockStore.dispatch,
      });
    });

    it("should call beforeUnmount with state and dispatch", async () => {
      const beforeUnmount = vi.fn();
      const wrapper = WithRedux(mockRoute);

      const route = wrapper({
        name: "test",
        path: "test/",
        store: mockStore,
        beforeUnmount,
      });

      await route.unmount();

      expect(beforeUnmount).toHaveBeenCalledWith({
        state: mockStore.getState(),
        dispatch: mockStore.dispatch,
      });
    });

    it("should call afterUnmount with state and dispatch", async () => {
      const afterUnmount = vi.fn();
      const wrapper = WithRedux(mockRoute);

      const route = wrapper({
        name: "test",
        path: "test/",
        store: mockStore,
        afterUnmount,
      });

      await route.unmount();

      expect(afterUnmount).toHaveBeenCalledWith({
        state: mockStore.getState(),
        dispatch: mockStore.dispatch,
      });
    });

    it("should call lifecycle hooks in correct order", async () => {
      const order: string[] = [];
      const beforeMount = vi.fn(() => {
        order.push("beforeMount");
      });
      const afterMount = vi.fn(() => {
        order.push("afterMount");
      });
      const composedMount = vi.fn(() => {
        order.push("composedMount");
      });

      mockRoute.mockReturnValue({
        mount: composedMount,
        unmount: vi.fn(),
      });

      const wrapper = WithRedux(mockRoute);
      const route = wrapper({
        name: "test",
        path: "test/",
        store: mockStore,
        beforeMount,
        afterMount,
      });

      await route.mount();

      expect(order).toEqual(["beforeMount", "composedMount", "afterMount"]);
    });
  });

  describe("Integration with composed routes", () => {
    it("should call composed route mount", async () => {
      const composedMount = vi.fn();
      mockRoute.mockReturnValue({
        mount: composedMount,
        unmount: vi.fn(),
      });

      const wrapper = WithRedux(mockRoute);
      const route = wrapper({
        name: "test",
        path: "test/",
        store: mockStore,
      });

      await route.mount();
      expect(composedMount).toHaveBeenCalled();
    });

    it("should call composed route unmount", async () => {
      const composedUnmount = vi.fn();
      mockRoute.mockReturnValue({
        mount: vi.fn(),
        unmount: composedUnmount,
      });

      const wrapper = WithRedux(mockRoute);
      const route = wrapper({
        name: "test",
        path: "test/",
        store: mockStore,
      });

      await route.unmount();
      expect(composedUnmount).toHaveBeenCalled();
    });

    it("should preserve this context when calling composed methods", async () => {
      let capturedThis: unknown;
      const composedMount = vi.fn(function (this: unknown) {
        capturedThis = this;
      });

      mockRoute.mockReturnValue({
        mount: composedMount,
        unmount: vi.fn(),
        customProp: "test",
      });

      const wrapper = WithRedux(mockRoute);
      const route = wrapper({
        name: "test",
        path: "test/",
        store: mockStore,
      });

      await route.mount();
      expect(capturedThis).toBe(route);
    });
  });

  describe("State updates", () => {
    it("should provide current state when lifecycle hooks are called", async () => {
      const beforeMount = vi.fn();
      const wrapper = WithRedux(mockRoute);

      const route = wrapper({
        name: "test",
        path: "test/",
        store: mockStore,
        beforeMount,
      });

      // Update store state
      mockStore.dispatch({ type: "counter/increment" });

      await route.mount();

      expect(beforeMount).toHaveBeenCalledWith({
        state: expect.objectContaining({
          counter: { value: 1 },
        }),
        dispatch: mockStore.dispatch,
      });
    });
  });

  describe("Edge cases", () => {
    it("should work without a component", () => {
      const wrapper = WithRedux(mockRoute);
      const route = wrapper({
        name: "test",
        path: "test/",
        store: mockStore,
      });

      expect(route).toBeDefined();
      expect(route.store).toBe(mockStore);
    });

    it("should work without lifecycle hooks", async () => {
      const wrapper = WithRedux(mockRoute);
      const route = wrapper({
        name: "test",
        path: "test/",
        store: mockStore,
      });

      // Should not throw
      await expect(route.mount()).resolves.toBeUndefined();
      await expect(route.unmount()).resolves.toBeUndefined();
    });

    it("should work without a composed route creator", () => {
      const wrapper = WithRedux();
      const route = wrapper({
        name: "test",
        path: "test/",
        store: mockStore,
      });

      expect(route).toBeDefined();
      expect(route.store).toBe(mockStore);
    });

    it("should handle async lifecycle hooks", async () => {
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));
      const beforeMount = vi.fn(async () => {
        await delay(10);
      });

      const wrapper = WithRedux(mockRoute);
      const route = wrapper({
        name: "test",
        path: "test/",
        store: mockStore,
        beforeMount,
      });

      await route.mount();
      expect(beforeMount).toHaveBeenCalled();
    });
  });
});
