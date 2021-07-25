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
    name: 'non-auth',
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
    afterMount: async () => activateFirstChildOf(router, 'non-auth'),
    children,
  })
}

export { getRoute }
