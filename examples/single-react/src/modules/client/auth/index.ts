import {
  redirect,
  activateFirstChildOf,
  ModuleRoute,
  ModuleRouteInterface,
  AnyRouteInterface,
  RouterInterface,
} from 'router/index'
import { store } from 'modules/client'

function getRoute(router: RouterInterface, children: AnyRouteInterface[] = []): ModuleRouteInterface {
  return ModuleRoute({
    name: 'auth',
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
    afterMount: async () => activateFirstChildOf(router, 'auth'),
    children,
  })
}

export { getRoute }
