import {
  Route,
  WithReactComponent,
  RouteInterface,
  WithReactComponentInterface,
  AnyRouteInterface,
  RouterInterface,
} from 'services/router'

import { Page } from './components/Page'

function getRoute(
  _router: RouterInterface,
  children: AnyRouteInterface[] = [],
): WithReactComponentInterface & RouteInterface {
  return WithReactComponent(Route)({
    name: 'sign-up',
    path: 'sign-up/',
    component: Page,
    children,
  })
}

export { getRoute }
