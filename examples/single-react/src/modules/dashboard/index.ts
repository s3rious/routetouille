import {
  Route,
  WithReactComponent,
  RouteInterface,
  WithReactComponentInterface,
  AnyRouteInterface,
  RouterInterface,
} from 'router/index'

import { Dashboard } from './Dashboard'

function getRoute(
  _router: RouterInterface,
  children: AnyRouteInterface[] = [],
): WithReactComponentInterface & RouteInterface {
  return WithReactComponent(Route)({
    name: 'dashboard',
    path: 'dashboard/',
    Component: Dashboard,
    children,
  })
}

export { getRoute }
