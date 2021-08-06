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
    name: 'non-auth',
    beforeMount: async () => activateFirstChildOf(router, 'non-auth'),
    redirects: [
      redirect(
        router,
        async () => {
          const { accessToken } = store.getState()

          return Boolean(accessToken)
        },
        'auth',
      ),
    ],
    children,
  })
}

export { getRoute }
