import { Route, Router } from "services/router/index.js";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { $accessToken } from "domains/client";
import { getRoute } from "./index.js";

vi.mock("domains/client");

const router = Router({});
const nonAuthChildren1Route = Route({
  name: "children1",
  path: "children1/",
});
const nonAuthChildren2Route = Route({
  name: "children2",
  path: "children2/",
});
const nonAuthRoute = getRoute(router, [
  nonAuthChildren1Route,
  nonAuthChildren2Route,
]);
const authRoute = Route({
  name: "auth",
  path: "auth/",
});
const rootRoute = Route({
  name: "root",
  path: "/",
  children: [nonAuthRoute, authRoute],
});
router.root = rootRoute;

async function wait(timeout = 1): Promise<void> {
  return await new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

describe("when `accessToken` is set", () => {
  beforeAll(async () => {
    router.active = [];
    vi.clearAllMocks();

    // @ts-expect-error
    $accessToken.getState.mockImplementation(() => "123");

    await router.goTo("non-auth");
  });

  afterEach(async () => {
    await wait();
  });

  it("should redirect to `auth`", () => {
    expect(router.active[router.active.length - 1].name).toEqual("auth");
  });
});

describe("when `accessToken` is not set", () => {
  beforeAll(async () => {
    router.active = [];
    vi.clearAllMocks();

    // @ts-expect-error
    $accessToken.getState.mockImplementation(() => null);

    await router.goTo("non-auth");
  });

  afterEach(async () => {
    await wait();
  });

  it("should redirect to first children of `non-auth`", async () => {
    expect(router.active[router.active.length - 1].name).toEqual("children1");
  });
});
