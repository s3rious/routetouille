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
    name: "dashboard",
    beforeMount: async () => activateFirstChildOf(router, "dashboard"),
    afterMount: async () => {
      await effects.fetchDashboard();
    },
    children,
  });
}

export { getRoute };
