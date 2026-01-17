import {
  FallbackRoute,
  type FallbackRouteInterface,
  type RouterInterface,
  WithReactComponent,
  type WithReactComponentInterface,
} from "services/router/index.js";

import { Fallback } from "./components/Fallback/index.js";

function getRoute(
  _router: RouterInterface,
): WithReactComponentInterface & FallbackRouteInterface {
  return WithReactComponent(FallbackRoute)({
    name: "404",
    component: Fallback,
  });
}

export { getRoute };
