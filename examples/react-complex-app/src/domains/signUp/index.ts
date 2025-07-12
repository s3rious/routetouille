import {
  Route,
  type RouteInterface,
  type RouterInterface,
  WithReactComponent,
  type WithReactComponentInterface,
} from "services/router/index.js";

import { Page } from "./components/Page/index.js";
import { SignUp } from "./components/SignUp/index.js";

function getRoute(
  _router: RouterInterface,
): WithReactComponentInterface & RouteInterface {
  return WithReactComponent(Route)({
    name: "sign-up",
    path: "sign-up/",
    component: Page,
    exclusive: true,
    children: [
      WithReactComponent(Route)({
        name: "sign-up-form",
        path: "form/",
        component: SignUp,
      }),
    ],
  });
}

export { getRoute };
