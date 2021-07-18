import { Route, RouteInterface, RouterInterface } from 'routetouille'

import { WithReactComponent, WithReactComponentInterface, AnyRouteInterface } from 'router/routes'

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
