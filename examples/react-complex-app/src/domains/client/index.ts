import {
  type AnyRouteInterface,
  ModuleRoute,
  type ModuleRouteInterface,
  type RouterInterface,
} from "services/router/index.js";

import { getRoute as getAuthRoute } from "./domains/auth/index.js";
import { getRoute as getNonAuthRoute } from "./domains/non-auth/index.js";

function getRoute(
  _router: RouterInterface,
  children: AnyRouteInterface[] = [],
): ModuleRouteInterface {
  return ModuleRoute({
    name: "client",
    beforeMount: async () => {},
    children,
  });
}

export { getRoute };
export * from "./store/index.js";
export { getAuthRoute, getNonAuthRoute };
export { effects } from "./store/index.js";
