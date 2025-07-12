import { describe, it, expect } from "vitest";
import { WithParams } from "./WithParams.js";
import {
  WithPathname,
  type WithPathnameInterface,
  type WithPathnameOptions,
} from "../WithPathname/index.js";
import {
  WithActive,
  type WithActiveInterface,
  type WithActiveOptions,
} from "../WithActive/index.js";
import {
  WithRoot,
  type WithRootInterface,
  type WithRootOptions,
} from "../WithRoot/index.js";
import {
  WithMap,
  type WithMapInterface,
  type WithMapOptions,
} from "../WithMap/index.js";
import { Route } from "../../Route/index.js";

type RouterComposedOptions = WithPathnameOptions &
  WithActiveOptions &
  WithMapOptions &
  WithRootOptions;
type RouterComposedInterface = WithPathnameInterface &
  WithActiveInterface &
  WithMapInterface &
  WithRootInterface;

describe("`WithParams` router", () => {
  const Router = WithParams<RouterComposedOptions, RouterComposedInterface>(
    WithPathname(WithActive(WithMap(WithRoot()))),
  );

  describe("creation", () => {
    it("created with proper `active`", () => {
      const root = Route({ name: "root", path: "/" });
      const router = Router({ root });

      expect(router.pathname).toEqual(null);
    });
  });

  describe("methods", () => {
    it("`activate`", async () => {
      const router = Router({
        root: Route({
          name: "root",
          path: "/",
          children: [
            Route({
              name: "post",
              path: ":id/",
              children: [
                Route({
                  name: "comments",
                  path: "comments/",
                  children: [
                    Route({
                      name: "comment",
                      path: ":id/",
                      children: [
                        Route({
                          name: "mode",
                          path: "?mode=:mode",
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      });

      await router.activate("post.comments.comment.mode", [
        { id: "1" },
        { id: "2" },
        { mode: "edit" },
      ]);

      expect(router.params).toEqual([
        { id: "1" },
        { id: "2" },
        { mode: "edit" },
      ]);
      expect(router.pathname).toEqual("/1/comments/2/?mode=edit");
    });
  });
});
