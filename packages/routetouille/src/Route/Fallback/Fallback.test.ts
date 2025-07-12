import { describe, it, expect } from "vitest";
import { Fallback } from "./Fallback.js";

describe("`Fallback` route", () => {
  describe("creation", () => {
    it("works as intended", () => {
      const route = Fallback()({});

      expect(route).toEqual({ fallback: true });
    });
  });

  describe("extends", () => {
    const extend = { foo: "bar" };

    function Extendable() {
      return () => extend;
    }

    it("extends parent", () => {
      const expected = { ...extend };

      const route = Fallback(Extendable())({});

      expect(route).not.toBe(extend);
      expect(route).not.toEqual(extend);
      expect(route).toEqual({ fallback: true, ...expected });
    });
  });
});
