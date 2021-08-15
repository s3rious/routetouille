import {
  Route,
  WithReactComponent,
  RouteInterface,
  WithReactComponentInterface,
  AnyRouteInterface,
  RouterInterface,
} from 'services/router'

import { Dashboard } from './components/Dashboard'

function getRoute(
  _router: RouterInterface,
  children: AnyRouteInterface[] = [],
): WithReactComponentInterface & RouteInterface {
  return WithReactComponent(Route)({
    name: 'dashboard',
    path: 'dashboard/',
    component: Dashboard,
    children,
  })
}

export { getRoute }
