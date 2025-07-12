import { Route, Router } from "services/router";
import {
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
  afterAll,
} from "vitest";

import { $accessToken, $client } from "domains/client";
import * as effects from "domains/client/store/effects";
import { getRoute } from "./index.js";

vi.mock("domains/client");

const router = Router({});
const authChildren1Route = Route({
  name: "children1",
  path: "children1/",
});
const authChildren2Route = Route({
  name: "children2",
  path: "children2/",
});
const authRoute = getRoute(router, [authChildren1Route, authChildren2Route]);
const nonAuthRoute = Route({
  name: "non-auth",
  path: "non-auth/",
});
const rootRoute = Route({
  name: "root",
  path: "/",
  children: [authRoute, nonAuthRoute],
});
router.root = rootRoute;

async function wait(timeout = 1): Promise<void> {
  return await new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

describe("when `accessToken` is not set", () => {
  beforeAll(async () => {
    router.active = [];
    vi.clearAllMocks();

    $accessToken.getState.mockImplementation(() => null);

    await router.goTo("auth");
  });

  afterEach(async () => {
    await wait();
  });

  it("should redirect to `non-auth`", () => {
    expect(router.active[router.active.length - 1].name).toEqual("non-auth");
  });

  it("`fetchClient` should not have been called", () => {
    const spy = vi.fn();
    const unsub = effects.fetchClient.watch(spy);
    expect(spy).not.toHaveBeenCalled();
    unsub();
  });
});

describe("when `accessToken` is set", () => {
  describe("when `client` is not fetched", () => {
    let spy: ReturnType<typeof vi.fn>;
    let unsub: () => void;

    beforeAll(async () => {
      router.active = [];
      vi.clearAllMocks();

      $accessToken.getState.mockImplementation(
        () => "accessToken+test.user@example.com+password",
      );
      $client.getState.mockImplementation(() => ({ isFetched: () => false }));

      spy = vi.fn();
      unsub = effects.fetchClient.watch(spy);

      await router.goTo("auth");
    });

    afterAll(() => {
      unsub();
    });

    afterEach(async () => {
      await wait();
    });

    it("should redirect to first children of `auth`", async () => {
      expect(router.active[router.active.length - 1].name).toEqual("children1");
    });

    it("`fetchClient` should have been called with `accessToken`", () => {
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith({
        accessToken: "accessToken+test.user@example.com+password",
      });
    });
  });

  describe("when `client` is fetched", () => {
    let spy: ReturnType<typeof vi.fn>;
    let unsub: () => void;

    beforeAll(async () => {
      router.active = [];
      vi.clearAllMocks();

      $accessToken.getState.mockImplementation(
        () => "accessToken+test.user@example.com+password",
      );
      $client.getState.mockImplementation(() => ({ isFetched: () => true }));

      spy = vi.fn();
      unsub = effects.fetchClient.watch(spy);

      await router.goTo("auth");
    });

    afterAll(() => {
      unsub();
    });

    afterEach(async () => {
      await wait();
    });

    it("should redirect to first children of `auth`", () => {
      expect(router.active[router.active.length - 1].name).toEqual("children1");
    });

    it("`fetchClient` should not have been called", () => {
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
