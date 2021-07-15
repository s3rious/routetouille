import { AbstractRoute, Route, RouteInterface, RouterInterface } from 'routetouille'

import { WithReactComponent, WithReactComponentInterface } from '../../../routes/WithReactComponent'

import { SignUp } from './SignUp'

function getRoute(
  _router: RouterInterface,
  children: AbstractRoute[] = [],
): WithReactComponentInterface & RouteInterface {
  return WithReactComponent(Route)({
    name: 'sign-up',
    path: 'sign-up/',
    Component: SignUp,
    children,
  })
}

export { getRoute }
