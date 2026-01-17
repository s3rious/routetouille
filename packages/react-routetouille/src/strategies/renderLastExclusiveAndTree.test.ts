import { describe, it, expect, vi } from "vitest";
import * as React from "react";
import { render } from "@testing-library/react";
import { renderLastExclusiveAndTree } from "./renderLastExclusiveAndTree.js";

describe("renderLastExclusiveAndTree", () => {
  const router = { active: [], getMap: vi.fn(), activate: vi.fn() };
  it("renders null if no active routes", () => {
    const result = renderLastExclusiveAndTree(router, []);
    expect(result).not.toBeNull();
    const { container } = render(result);
    expect(container.querySelector("div")).toBeNull();
  });

  it("renders a tree of components for active routes with components", () => {
    const DummyComponent = vi.fn(() =>
      React.createElement("div", null, "Dummy"),
    );
    const route1 = { component: DummyComponent };
    const route2 = { component: DummyComponent };
    const result = renderLastExclusiveAndTree(router, [route1, route2]);
    const { getAllByText } = render(result);
    expect(getAllByText("Dummy").length).toBeGreaterThan(0);
  });

  it("renders only routes after the last exclusive route", () => {
    const DummyComponent = vi.fn(() =>
      React.createElement("div", null, "Dummy"),
    );
    const route1 = { component: DummyComponent };
    const route2 = { component: DummyComponent, exclusive: true };
    const route3 = { component: DummyComponent };
    const result = renderLastExclusiveAndTree(router, [route1, route2, route3]);
    const { getAllByText } = render(result);
    expect(getAllByText("Dummy").length).toBe(2);
  });

  it("provides the router in context", () => {
    const DummyComponent = vi.fn(() =>
      React.createElement("div", null, "Dummy"),
    );
    const route = { component: DummyComponent };
    const result = renderLastExclusiveAndTree(router, [route]);
    const { container } = render(result);
    expect(container.querySelector("div")).not.toBeNull();
  });
});
