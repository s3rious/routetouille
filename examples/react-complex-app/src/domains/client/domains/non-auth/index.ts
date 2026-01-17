import {
  type AnyRouteInterface,
  ModuleRoute,
  type ModuleRouteInterface,
  type RouterInterface,
  activateFirstChildOf,
  redirect,
} from "services/router/index.js";

import { $accessToken } from "domains/client/index.js";

function getRoute(
  router: RouterInterface,
  children: AnyRouteInterface[] = [],
): ModuleRouteInterface {
  return ModuleRoute({
    name: "non-auth",
    beforeMount: async () => activateFirstChildOf(router, "non-auth"),
    redirects: [
      redirect(
        router,
        async () => {
          const accessToken = $accessToken.getState();

          return Boolean(accessToken);
        },
        "auth",
      ),
    ],
    children,
  });
}

export { getRoute };
