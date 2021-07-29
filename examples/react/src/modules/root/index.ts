import {
  ModuleRoute,
  WithReactRoot,
  ModuleRouteInterface,
  WithReactRootInterface,
  AnyRouteInterface,
  RouterInterface,
} from 'router/index'

import { Root } from './components/Root'

function getRoute(
  router: RouterInterface,
  children: AnyRouteInterface[] = [],
): WithReactRootInterface & ModuleRouteInterface {
  return WithReactRoot(ModuleRoute)({
    router,
    name: 'root',
    id: 'root',
    preloaderId: 'preloader',
    component: Root,
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