import { describe, it, expect, vi, afterEach } from "vitest";
import type * as React from "react";
import { renderHook, act } from "@testing-library/react";
import { useLink } from "./useLink.js";
import * as useRouterModule from "./useRouter.js";

vi.mock("./useRouter.js", () => ({ useRouter: vi.fn() }));

describe("useLink", () => {
  const mockRouter = {
    urlTo: vi.fn(() => "/foo"),
    goTo: vi.fn(),
    history: {},
    getMap: vi.fn(),
    activate: vi.fn(),
  };

  afterEach(() => {
    (useRouterModule.useRouter as vi.Mock).mockReset();
    mockRouter.urlTo.mockReset();
    mockRouter.goTo.mockReset();
  });

  it("returns correct href when router and to are provided", () => {
    (useRouterModule.useRouter as vi.Mock).mockReturnValue(mockRouter);
    const { result } = renderHook(() =>
      useLink<string, { id: number }>({ to: "foo", params: { id: 1 } }),
    );
    expect(result.current.href).toBe("/foo");
  });

  it("returns hrefProp if router or to is missing", () => {
    (useRouterModule.useRouter as vi.Mock).mockReturnValue(undefined);
    const { result } = renderHook(() =>
      useLink<string, { id: number }>({ href: "/bar" }),
    );
    expect(result.current.href).toBe("/bar");
  });

  it("handleClick calls goTo and prevents default", async () => {
    const goTo = vi.fn();
    (useRouterModule.useRouter as vi.Mock).mockReturnValue({
      ...mockRouter,
      goTo,
    });
    const { result } = renderHook(() =>
      useLink<string, { id: number }>({ to: "foo", params: { id: 1 } }),
    );
    const event = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    }) as unknown as React.MouseEvent<HTMLAnchorElement>;
    event.preventDefault = vi.fn();
    await act(() => result.current.handleClick(event));
    expect(event.preventDefault).toHaveBeenCalled();
    expect(goTo).toHaveBeenCalled();
  });

  it("handleClick does nothing if to or router is missing", async () => {
    (useRouterModule.useRouter as vi.Mock).mockReturnValue(undefined);
    const { result } = renderHook(() => useLink<string, { id: number }>({}));
    const event = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    }) as unknown as React.MouseEvent<HTMLAnchorElement>;
    event.preventDefault = vi.fn();
    await act(() => result.current.handleClick(event));
    expect(event.preventDefault).not.toHaveBeenCalled();
  });
});
