import {
  type AnyRouteInterface,
  ModuleRoute,
  type ModuleRouteInterface,
  type RouterInterface,
  activateFirstChildOf,
} from "services/router/index.js";

import { effects } from "./store/index.js";

function getRoute(
  router: RouterInterface,
  children: AnyRouteInterface[] = [],
): ModuleRouteInterface {
  return ModuleRoute({
    name: "posts",
    beforeMount: async () => activateFirstChildOf(router, "posts"),
    afterMount: async () => {
      await effects.fetchPosts();
    },
    children,
  });
}

export { getRoute };
export * from "./store/index.js";
