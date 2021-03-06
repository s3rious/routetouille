import {
  redirect,
  activateFirstChildOf,
  ModuleRoute,
  ModuleRouteInterface,
  AnyRouteInterface,
  RouterInterface,
} from 'services/router'
import { $accessToken } from 'domains/client'

function getRoute(router: RouterInterface, children: AnyRouteInterface[] = []): ModuleRouteInterface {
  return ModuleRoute({
    name: 'non-auth',
    beforeMount: async () => activateFirstChildOf(router, 'non-auth'),
    redirects: [
      redirect(
        router,
        async () => {
          const accessToken = $accessToken.getState()

          return Boolean(accessToken)
        },
        'auth',
      ),
    ],
    children,
  })
}

export { getRoute }
