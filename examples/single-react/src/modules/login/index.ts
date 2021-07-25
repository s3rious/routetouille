import {
  Route,
  WithReactComponent,
  RouteInterface,
  WithReactComponentInterface,
  AnyRouteInterface,
  RouterInterface,
} from 'router/index'

import { LogIn } from './LogIn'

function getRoute(
  _router: RouterInterface,
  children: AnyRouteInterface[] = [],
): WithReactComponentInterface & RouteInterface {
  return WithReactComponent(Route)({
    name: 'login',
    path: 'login/',
    Component: LogIn,
    children,
  })
}

export { getRoute }
