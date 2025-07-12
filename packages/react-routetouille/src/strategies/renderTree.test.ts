import { describe, it, expect, vi } from "vitest";
import * as React from "react";
import { render } from "@testing-library/react";
import { renderTree } from "./renderTree.js";

describe("renderTree", () => {
  const router = { active: [], getMap: vi.fn(), activate: vi.fn() };
  it("renders null if no active routes", () => {
    const result = renderTree(router, []);
    expect(result).not.toBeNull();
    const { container } = render(result);
    expect(container.querySelector("div")).toBeNull();
  });

  it("renders a tree of components for active routes with components", () => {
    const route1 = {
      component: vi.fn(() => React.createElement("div", null, "Dummy")),
    };
    const route2 = {
      component: vi.fn(() => React.createElement("div", null, "Dummy")),
    };
    const result = renderTree(router, [route1, route2]);
    const { getAllByText } = render(result);
    expect(getAllByText("Dummy").length).toBeGreaterThan(0);
  });

  it("provides the router in context", () => {
    const route = {
      component: vi.fn(() => React.createElement("div", null, "Dummy")),
    };
    const result = renderTree(router, [route]);
    const { container } = render(result);
    expect(container.querySelector("div")).not.toBeNull();
  });
});
