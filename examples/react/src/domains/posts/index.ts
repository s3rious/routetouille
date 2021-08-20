import {
  ModuleRoute,
  ModuleRouteInterface,
  AnyRouteInterface,
  RouterInterface,
  activateFirstChildOf,
} from 'services/router'

import { effects } from './store'

function getRoute(router: RouterInterface, children: AnyRouteInterface[] = []): ModuleRouteInterface {
  return ModuleRoute({
    name: 'posts',
    beforeMount: async () => activateFirstChildOf(router, 'posts'),
    afterMount: async () => {
      await effects.fetchPosts()
    },
    children,
  })
}

export { getRoute }
export * from './store'
