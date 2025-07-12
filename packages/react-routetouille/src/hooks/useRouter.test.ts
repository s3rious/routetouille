import { describe, it, expect, vi } from "vitest";
import * as React from "react";
import { useRouter } from "./useRouter.js";
import { Context, type ContextValue } from "../Context/Context.js";

function withContextValue(value: ContextValue, children: React.ReactNode) {
  return React.createElement(Context.Provider, { value }, children);
}

describe("useRouter", () => {
  const mockRouter = { getMap: vi.fn(), activate: vi.fn(), active: [] };

  it("returns router from context", () => {
    const { result } = require("@testing-library/react").renderHook(
      () => useRouter(),
      {
        wrapper: ({ children }: { children: React.ReactNode }) =>
          withContextValue({ router: mockRouter }, children),
      },
    );
    expect(result.current).toBe(mockRouter);
  });

  it("returns undefined if context is empty object", () => {
    const { result } = require("@testing-library/react").renderHook(
      () => useRouter(),
      {
        wrapper: ({ children }: { children: React.ReactNode }) =>
          withContextValue({ router: undefined }, children),
      },
    );
    expect(result.current).toBeUndefined();
  });

  it("returns undefined if context is undefined", () => {
    const { result } = require("@testing-library/react").renderHook(
      () => useRouter(),
      {
        wrapper: ({ children }: { children: React.ReactNode | undefined }) =>
          withContextValue({ router: undefined }, children),
      },
    );
    expect(result.current).toBeUndefined();
  });
});
