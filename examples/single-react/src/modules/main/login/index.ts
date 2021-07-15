import { Route, AbstractRoute, RouteInterface, RouterInterface } from 'routetouille'

import { WithReactComponent, WithReactComponentInterface } from '../../../routes/WithReactComponent'

import { Login } from './Login'

function getRoute(
  _router: RouterInterface,
  children: AbstractRoute[] = [],
): WithReactComponentInterface & RouteInterface {
  return WithReactComponent(Route)({
    name: 'login',
    path: 'login/',
    Component: Login,
    children,
  })
}

export { getRoute }
