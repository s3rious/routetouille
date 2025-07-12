import {
  type AnyRouteInterface,
  ModuleRoute,
  type ModuleRouteInterface,
  type RouterInterface,
  activateFirstChildOf,
  redirect,
} from "services/router/index.js";

import { $accessToken, $client } from "domains/client/index.js";
import * as clientEffects from "domains/client/store/effects";

function getRoute(
  router: RouterInterface,
  children: AnyRouteInterface[] = [],
): ModuleRouteInterface {
  return ModuleRoute({
    name: "auth",
    beforeMount: async () => activateFirstChildOf(router, "auth"),
    afterMount: async () => {
      const isClientFetched = $client.getState().isFetched();
      const accessToken = $accessToken.getState();

      if (!isClientFetched && accessToken) {
        await clientEffects.fetchClient({ accessToken });
      }
    },
    redirects: [
      redirect(
        router,
        async () => {
          const accessToken = $accessToken.getState();

          return !accessToken;
        },
        "non-auth",
      ),
    ],
    children,
  });
}

export { getRoute };
