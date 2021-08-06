import {
  redirect,
  activateFirstChildOf,
  ModuleRoute,
  ModuleRouteInterface,
  AnyRouteInterface,
  RouterInterface,
} from 'router/index'
import { store } from 'domains/client'

function getRoute(router: RouterInterface, children: AnyRouteInterface[] = []): ModuleRouteInterface {
  return ModuleRoute({
    name: 'auth',
    beforeMount: async () => activateFirstChildOf(router, 'auth'),
    redirects: [
      redirect(
        router,
        async () => {
          const { accessToken } = store.getState()

          return !Boolean(accessToken)
        },
        'non-auth',
      ),
    ],
    children,
  })
}

export { getRoute }
