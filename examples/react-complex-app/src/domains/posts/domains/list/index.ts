import {
  type AnyRouteInterface,
  Route,
  type RouteInterface,
  type RouterInterface,
  WithReactComponent,
  type WithReactComponentInterface,
} from "services/router";

import { List } from "./components/List/index.js";

function getRoute(
  _router: RouterInterface,
  children: AnyRouteInterface[] = [],
): WithReactComponentInterface & RouteInterface {
  return WithReactComponent(Route)({
    name: "post-list",
    path: "posts/",
    component: List,
    exclusive: true,
    children,
  });
}

export { getRoute };
