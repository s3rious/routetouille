import to from "await-to-js";
import {
  Route,
  type RouteInterface,
  type RouterInterface,
  WithReactComponent,
  type WithReactComponentInterface,
} from "services/router";

import { effects as clientEffects } from "domains/client";

import { LogOut } from "./components/LogOut/index.js";

function getRoute(
  router: RouterInterface,
): WithReactComponentInterface & RouteInterface {
  return WithReactComponent(Route)({
    name: "logout",
    path: "logout/",
    afterMount: async () => {
      const [error] = await to(clientEffects.logOut({}));

      if (error) {
        globalThis.localStorage.removeItem("CLIENT_ACCESS_TOKEN");
        globalThis.location.href = "/";
        return;
      }

      await router.goTo("non-auth.login");
    },
    component: LogOut,
    exclusive: true,
  });
}

export { getRoute };
