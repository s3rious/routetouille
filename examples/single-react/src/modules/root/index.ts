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
    beforeMount: async () => {
      if (router.pathname === '/') {
        if (router.active[router.active.length - 1].fallback) {
          await router.goTo('non-auth', { method: 'replace', optimistic: true })
        }
      }
    },
    children,
  })
}

export { getRoute }
