import {
  type AnyRouteInterface,
  Route,
  type RouteInterface,
  type RouterInterface,
  WithReactComponent,
  type WithReactComponentInterface,
} from "services/router";

import { Post } from "./components/Post/index.js";

function getRoute(
  _router: RouterInterface,
  children: AnyRouteInterface[] = [],
): WithReactComponentInterface & RouteInterface {
  return WithReactComponent(Route)({
    name: "post",
    path: ":postId/",
    component: Post,
    exclusive: true,
    children,
  });
}

export { getRoute };
