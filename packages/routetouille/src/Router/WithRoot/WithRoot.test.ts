import { describe, it, expect } from "vitest";
import { WithRoot } from "./WithRoot.js";
import { Route } from "../../Route/index.js";

describe("`WithRoot` router", () => {
  describe("creation", () => {
    it("created with proper root", () => {
      const root = Route({ name: "root", path: "/" });
      const router = WithRoot()({ root });
      const expected = {
        root: {
          name: "root",
          path: "/",
          mounted: false,
        },
      };

      expect(router.root).toBe(root);
      expect(JSON.stringify(router)).toEqual(JSON.stringify(expected));
    });
  });
});
