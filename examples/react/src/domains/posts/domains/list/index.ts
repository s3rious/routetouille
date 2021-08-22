import {
  Route,
  WithReactComponent,
  RouteInterface,
  WithReactComponentInterface,
  AnyRouteInterface,
  RouterInterface,
} from 'services/router'

import { List } from './components/List'

function getRoute(
  _router: RouterInterface,
  children: AnyRouteInterface[] = [],
): WithReactComponentInterface & RouteInterface {
  return WithReactComponent(Route)({
    name: 'posts-list',
    path: 'posts/',
    component: List,
    exclusive: true,
    children,
  })
}

export { getRoute }
