import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { WithReactRoot } from "./WithReactRoot.js";
import type { WithReactRootOptions } from "./WithReactRoot.js";

// Mock ReactDOM fallback for legacy and modern branches
vi.mock("react-dom", () => ({
  createRoot: vi.fn(() => ({ render: vi.fn() })),
  render: vi.fn(),
  unmountComponentAtNode: vi.fn(),
}));

function createRoute(options: WithReactRootOptions) {
  return options;
}

describe("WithReactRoot", () => {
  let originalBody: string;
  let originalCreateElement: typeof document.createElement;
  let originalGetElementById: typeof document.getElementById;
  let originalCreateRoot: unknown;

  beforeEach(() => {
    originalBody = document.body.innerHTML;
    originalCreateElement = document.createElement;
    originalGetElementById = document.getElementById;
    originalCreateRoot = (globalThis as { createRoot?: unknown }).createRoot;
    (globalThis as { createRoot?: unknown }).createRoot = undefined;
  });

  afterEach(() => {
    document.body.innerHTML = originalBody;
    globalThis.document.createElement = originalCreateElement;
    globalThis.document.getElementById = originalGetElementById;
    (globalThis as { createRoot?: unknown }).createRoot = originalCreateRoot;
  });

  it("calls beforeMount and mounts React component", async () => {
    const Dummy = () => null;
    const options = {
      id: "test-root",
      router: {} as unknown,
      component: Dummy,
    };
    const factory = WithReactRoot(createRoute);
    await factory(options).beforeMount();
    expect(document.getElementById("test-root")).not.toBeNull();
  });

  it("calls afterMount and removes preloader if present", async () => {
    const preloader = document.createElement("div");
    preloader.id = "preloader-test";
    document.body.appendChild(preloader);
    const Dummy = () => null;
    const options = {
      id: "test-root",
      preloaderId: "preloader-test",
      router: {} as unknown,
      component: Dummy,
    };
    const factory = WithReactRoot(createRoute);
    await factory(options).afterMount();
    expect(document.getElementById("preloader-test")).toBeNull();
  });

  it("calls afterUnmount and removes root", async () => {
    const root = document.createElement("div");
    root.id = "test-root";
    document.body.appendChild(root);
    const Dummy = () => null;
    const options = {
      id: "test-root",
      router: {} as unknown,
      component: Dummy,
    };
    const factory = WithReactRoot(createRoute);
    await factory(options).afterUnmount();
    expect(document.getElementById("test-root")).toBeNull();
  });

  it("removes preloader after mount if preloaderId is provided", async () => {
    const preloader = document.createElement("div");
    preloader.id = "preloader-test";
    document.body.appendChild(preloader);
    const Dummy = () => null;
    const options = {
      id: "test-root-preloader",
      preloaderId: "preloader-test",
      router: {} as unknown,
      component: Dummy,
    };
    const factory = WithReactRoot(createRoute);
    await factory(options).afterMount();
    expect(document.getElementById("preloader-test")).toBeNull();
  });

  it("removes root after unmount", async () => {
    const root = document.createElement("div");
    root.id = "test-root-unmount";
    document.body.appendChild(root);
    const Dummy = () => null;
    const options = {
      id: "test-root-unmount",
      router: {} as unknown,
      component: Dummy,
    };
    const factory = WithReactRoot(createRoute);
    await factory(options).afterUnmount();
    expect(document.getElementById("test-root-unmount")).toBeNull();
  });
});

describe("WithReactRootOptions type", () => {
  it("should allow assignment of a valid root", () => {
    const options: WithReactRootOptions = {
      root: document.createElement("div"),
    };
    expect(options.root).toBeInstanceOf(HTMLElement);
  });
});
