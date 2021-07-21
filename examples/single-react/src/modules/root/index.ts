import {
  ModuleRoute,
  WithReactRoot,
  ModuleRouteInterface,
  WithReactRootInterface,
  AnyRouteInterface,
  RouterInterface,
} from 'router/index'

import { Root } from './Root'

function getRoute(
  router: RouterInterface,
  children: AnyRouteInterface[] = [],
): WithReactRootInterface & ModuleRouteInterface {
  return WithReactRoot(ModuleRoute)({
    router,
    name: 'root',
    id: 'root',
    Component: Root,
    children,
  })
}

export { getRoute }
