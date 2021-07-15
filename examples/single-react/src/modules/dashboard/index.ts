import { AbstractRoute, Route, RouteInterface, RouterInterface } from 'routetouille'

import { WithReactComponent, WithReactComponentInterface } from '../../routes/WithReactComponent'

import { Dashboard } from './Dashboard'

function getRoute(
  _router: RouterInterface,
  children: AbstractRoute[] = [],
): WithReactComponentInterface & RouteInterface {
  return WithReactComponent(Route)({
    name: 'dashboard',
    path: 'dashboard/',
    Component: Dashboard,
    children,
  })
}

export { getRoute }
