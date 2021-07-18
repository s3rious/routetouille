import { Route, RouteInterface, RouterInterface } from 'routetouille'

import { WithReactComponent, WithReactComponentInterface, AnyRouteInterface } from '../../../routes'

import { Login } from './Login'

function getRoute(
  _router: RouterInterface,
  children: AnyRouteInterface[] = [],
): WithReactComponentInterface & RouteInterface {
  return WithReactComponent(Route)({
    name: 'login',
    path: 'login/',
    Component: Login,
    children,
  })
}

export { getRoute }
