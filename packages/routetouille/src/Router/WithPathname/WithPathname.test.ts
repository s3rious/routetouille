import { describe, it, expect } from "vitest";
import { WithPathname } from "./WithPathname.js";
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

import { ModuleRoute, Route } from "../../Route/index.js";

describe("`WithPathname` router", () => {
  const Router = WithPathname<
    WithActiveOptions & WithMapOptions & WithRootOptions,
    WithActiveInterface & WithMapInterface & WithRootInterface
  >(WithActive(WithMap(WithRoot())));

  describe("creation", () => {
    it("created with proper `active`", () => {
      const root = Route({ name: "root", path: "/" });
      const router = Router({ root });

      expect(router.pathname).toEqual(null);
    });
  });

  describe("methods", () => {
    describe("`activate`", () => {
      it("changes pathname after activation", async () => {
        const router = Router({
          root: Route({
            name: "root",
            path: "/",
            children: [
              ModuleRoute({
                name: "auth",
                children: [
                  Route({
                    name: "dashboard",
                    path: "dashboard/",
                    children: [
                      Route({
                        name: "posts",
                        path: "posts/",
                        children: [
                          Route({
                            name: "post",
                            path: ":id/",
                            children: [
                              Route({
                                name: "edit",
                                path: "?edit",
                              }),
                            ],
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

        await router.activate("posts.post.edit");

        expect(router.pathname).toEqual("/dashboard/posts/:id/?edit");
      });
    });
  });
});
