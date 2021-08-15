import { ModuleRoute, ModuleRouteInterface, AnyRouteInterface, RouterInterface } from 'services/router'

function getRoute(router: RouterInterface, children: AnyRouteInterface[] = []): ModuleRouteInterface {
  return ModuleRoute({
    name: 'client',
    children,
  })
}

export { getRoute }
export * from './store'
