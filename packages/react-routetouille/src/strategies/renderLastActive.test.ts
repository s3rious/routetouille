import { describe, it, expect, vi } from "vitest";
import * as React from "react";
import { render } from "@testing-library/react";
import { renderLastActive } from "./renderLastActive.js";

describe("renderLastActive", () => {
  const router = { active: [], getMap: vi.fn(), activate: vi.fn() };
  it("returns null if no active routes", () => {
    const result = renderLastActive(router, []);
    expect(result).toBeNull();
  });

  it("renders the last active route if it has a component", () => {
    const DummyComponent = vi.fn(() =>
      React.createElement("div", null, "Dummy"),
    );
    const route1 = { component: DummyComponent };
    const route2 = { component: DummyComponent };
    const result = renderLastActive(router, [route1, route2]);
    const { getByText } = render(result);
    expect(getByText("Dummy")).toBeDefined();
  });

  it("returns null if the last active route does not have a component", () => {
    const route1 = { foo: "bar" };
    const result = renderLastActive(router, [route1]);
    expect(result).toBeNull();
  });

  it("provides the router in context", () => {
    const DummyComponent = vi.fn(() =>
      React.createElement("div", null, "Dummy"),
    );
    const route = { component: DummyComponent };
    const result = renderLastActive(router, [route]);
    const { container } = render(result);
    expect(container.querySelector("div")).not.toBeNull();
  });
});
