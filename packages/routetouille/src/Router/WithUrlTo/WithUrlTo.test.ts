import { describe, it, expect } from "vitest";
import { WithUrlTo } from "./WithUrlTo.js";
import {
  WithParams,
  type WithParamsOptions,
  type WithParamsInterface,
} from "../WithParams/index.js";
import {
  WithPathname,
  type WithPathnameOptions,
  type WithPathnameInterface,
} from "../WithPathname/index.js";
import {
  WithActive,
  type WithActiveOptions,
  type WithActiveInterface,
} from "../WithActive/index.js";
import {
  WithMap,
  type WithMapOptions,
  type WithMapInterface,
} from "../WithMap/index.js";
import {
  WithRoot,
  type WithRootOptions,
  type WithRootInterface,
} from "../WithRoot/index.js";
import { FallbackRoute, Route } from "../../Route/index.js";

type RouterComposedOptions = WithParamsOptions &
  WithPathnameOptions &
  WithActiveOptions &
  WithMapOptions &
  WithRootOptions;
type RouterComposedInterface = WithParamsInterface &
  WithPathnameInterface &
  WithActiveInterface &
  WithMapInterface &
  WithRootInterface;

describe("`WithUrlTo` router", () => {
  const Router = WithUrlTo<RouterComposedOptions, RouterComposedInterface>(
    WithParams(WithPathname(WithActive(WithMap(WithRoot())))),
  );

  describe("methods", () => {
    const router = Router({
      root: Route({
        name: "root",
        path: "/",
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
                            children: [
                              Route({
                                name: "hash",
                                path: "#hash",
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              FallbackRoute({
                name: "posts-404",
              }),
            ],
          }),
          FallbackRoute({
            name: "404",
          }),
        ],
      }),
    });

    it("`urlTo`", () => {
      // @ts-expect-error
      expect(router.urlTo(null)).toEqual(undefined);
      // @ts-expect-error
      expect(router.urlTo(undefined)).toEqual(undefined);
      expect(router.urlTo("")).toEqual(undefined);
      expect(router.urlTo([""])).toEqual(undefined);
      expect(router.urlTo("foo")).toEqual(undefined);
      expect(router.urlTo(["foo"])).toEqual(undefined);
      expect(router.urlTo("foo.bar")).toEqual(undefined);
      expect(router.urlTo(["foo", "bar"])).toEqual(undefined);

      expect(router.urlTo("root")).toEqual("/");
      expect(router.urlTo(["root"])).toEqual("/");

      expect(router.urlTo("root.posts")).toEqual("/posts/");
      expect(router.urlTo(["root", "posts"])).toEqual("/posts/");

      expect(router.urlTo("root.posts.post")).toEqual("/posts/:id/");
      expect(router.urlTo(["root", "posts", "post"])).toEqual("/posts/:id/");
      expect(router.urlTo("root.posts.post", [{ id: "34" }])).toEqual(
        "/posts/34/",
      );
      expect(router.urlTo(["root", "posts", "post"], [{ id: "34" }])).toEqual(
        "/posts/34/",
      );

      expect(router.urlTo("root.posts.post.comments")).toEqual(
        "/posts/:id/comments/",
      );
      expect(router.urlTo(["root", "posts", "post", "comments"])).toEqual(
        "/posts/:id/comments/",
      );
      expect(router.urlTo("root.posts.post.comments", [{ id: "34" }])).toEqual(
        "/posts/34/comments/",
      );
      expect(
        router.urlTo(["root", "posts", "post", "comments"], [{ id: "34" }]),
      ).toEqual("/posts/34/comments/");

      expect(router.urlTo("root.posts.post.comments.comment")).toEqual(
        "/posts/:id/comments/:id/",
      );
      expect(
        router.urlTo(["root", "posts", "post", "comments", "comment"]),
      ).toEqual("/posts/:id/comments/:id/");
      expect(
        router.urlTo("root.posts.post.comments.comment", [{ id: "34" }]),
      ).toEqual("/posts/34/comments/:id/");
      expect(
        router.urlTo(
          ["root", "posts", "post", "comments", "comment"],
          [{ id: "34" }],
        ),
      ).toEqual("/posts/34/comments/:id/");
      expect(
        router.urlTo("root.posts.post.comments.comment", [
          { id: "34" },
          { id: "69" },
        ]),
      ).toEqual("/posts/34/comments/69/");
      expect(
        router.urlTo(
          ["root", "posts", "post", "comments", "comment"],
          [{ id: "34" }, { id: "69" }],
        ),
      ).toEqual("/posts/34/comments/69/");

      expect(router.urlTo("root.posts.post.comments.comment.mode")).toEqual(
        "/posts/:id/comments/:id/?mode=:mode",
      );
      expect(
        router.urlTo(["root", "posts", "post", "comments", "comment", "mode"]),
      ).toEqual("/posts/:id/comments/:id/?mode=:mode");
      expect(
        router.urlTo("root.posts.post.comments.comment.mode", [
          { id: "34" },
          { id: "69" },
          { mode: "edit" },
        ]),
      ).toEqual("/posts/34/comments/69/?mode=edit");
      expect(
        router.urlTo(
          ["root", "posts", "post", "comments", "comment", "mode"],
          [{ id: "34" }, { id: "69" }, { mode: "edit" }],
        ),
      ).toEqual("/posts/34/comments/69/?mode=edit");

      expect(
        router.urlTo("root.posts.post.comments.comment.mode.hash"),
      ).toEqual("/posts/:id/comments/:id/?mode=:mode#hash");
      expect(
        router.urlTo([
          "root",
          "posts",
          "post",
          "comments",
          "comment",
          "mode",
          "hash",
        ]),
      ).toEqual("/posts/:id/comments/:id/?mode=:mode#hash");
      expect(
        router.urlTo("root.posts.post.comments.comment.mode.hash", [
          { id: "34" },
          { id: "69" },
          { mode: "edit" },
        ]),
      ).toEqual("/posts/34/comments/69/?mode=edit#hash");
      expect(
        router.urlTo(
          ["root", "posts", "post", "comments", "comment", "mode", "hash"],
          [{ id: "34" }, { id: "69" }, { mode: "edit" }],
        ),
      ).toEqual("/posts/34/comments/69/?mode=edit#hash");
    });
  });
});
