import { AbstractRoute, ModuleRoute, ModuleRouteInterface, RouterInterface } from 'routetouille'

import { WithReactRoot, WithReactRootInterface } from '../../routes/WithReactRoot'

import { Root } from './Root'

function getRoute(
  router: RouterInterface,
  children: AbstractRoute[] = [],
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
