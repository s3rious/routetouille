import { ModuleRoute, ModuleRouteInterface, RouterInterface } from 'routetouille'

import { WithReactRoot, WithReactRootInterface, AnyRouteInterface } from '../../routes/'

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
