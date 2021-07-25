import {
  Route,
  WithReactComponent,
  RouteInterface,
  WithReactComponentInterface,
  AnyRouteInterface,
  RouterInterface,
} from 'router/index'

import { SignUp } from './components/SignUp'

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
