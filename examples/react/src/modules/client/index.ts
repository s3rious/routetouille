import { ModuleRoute, ModuleRouteInterface, AnyRouteInterface, RouterInterface } from 'router/index'

import { store, effects } from './store'

function getRoute(router: RouterInterface, children: AnyRouteInterface[] = []): ModuleRouteInterface {
  return ModuleRoute({
    name: 'client',
    children,
  })
}

export { getRoute, store, effects }
