import { Route, RouteInterface, RouterInterface } from 'routetouille'

import { WithReactComponent, WithReactComponentInterface, AnyRouteInterface } from '../../../routes'

import { SignUp } from './SignUp'

function getRoute(
  _router: RouterInterface,
  children: AnyRouteInterface[] = [],
): WithReactComponentInterface & RouteInterface {
  return WithReactComponent(Route)({
    name: 'sign-up',
    path: 'sign-up/',
    Component: SignUp,
    children,
  })
}

export { getRoute }
