import { BrowserHistory, Router } from "services/router";

import { getRoute as getRootRoute } from "domains/root/index.js";

import { getRoute as getAuthRoute } from "domains/client/domains/auth/index.js";
import { getRoute as getNonAuthRoute } from "domains/client/domains/non-auth/index.js";
import { getRoute as getClientRoute } from "domains/client/index.js";

import { getRoute as getLoginRoute } from "domains/login/index.js";
import { getRoute as getLogOutRoute } from "domains/logout/index.js";
import { getRoute as getSignUpRoute } from "domains/signUp/index.js";

import { getRoute as getDashboardRoute } from "domains/dashboard/index.js";
import { getRoute as getPostsListRoute } from "domains/posts/domains/list/index.js";
import { getRoute as getPostRoute } from "domains/posts/domains/post/index.js";
import { getRoute as getPostsRoute } from "domains/posts/index.js";

import { getRoute as getFallbackRoute } from "domains/fallback/index.js";

// Add effector-logger in dev mode only
// @ts-expect-error import.meta.env is Vite-specific
if (import.meta.env?.MODE === "development") {
  import("effector-logger").then(({ attachLogger }) => {
    attachLogger();
  });
}

async function main(): Promise<void> {
  const router = Router({
    optimistic: true,
    history: BrowserHistory(),
  });

  router.root = getRootRoute(router, [
    getClientRoute(router, [
      getLogOutRoute(router),
      getNonAuthRoute(router, [getLoginRoute(router), getSignUpRoute(router)]),
      getAuthRoute(router, [
        getPostsRoute(router, [
          getDashboardRoute(router, [
            getPostsListRoute(router, [getPostRoute(router)]),
          ]),
        ]),
      ]),
    ]),
    getFallbackRoute(router),
  ]);

  await router.init();
}

void main();
