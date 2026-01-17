import {
  Route,
  type RouteInterface,
  type RouterInterface,
  WithReactComponent,
  type WithReactComponentInterface,
} from "services/router/index.js";

import { ForgotPassword } from "./components/ForgotPassword/index.js";
import { Page } from "./components/Page/index.js";

function getRoute(
  _router: RouterInterface,
): WithReactComponentInterface & RouteInterface {
  return WithReactComponent(Route)({
    name: "login",
    path: "login/",
    component: Page,
    exclusive: true,
    children: [
      Route({
        name: "reset-success",
        path: "?resetSuccess",
      }),
      WithReactComponent(Route)({
        name: "forgot-password",
        path: "forgot-password/",
        component: ForgotPassword,
      }),
    ],
  });
}

export { getRoute };
