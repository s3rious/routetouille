import {
  redirect,
  activateFirstChildOf,
  ModuleRoute,
  ModuleRouteInterface,
  AnyRouteInterface,
  RouterInterface,
} from 'services/router'

import { $accessToken, $client, effects as clientEffects } from 'domains/client'

function getRoute(router: RouterInterface, children: AnyRouteInterface[] = []): ModuleRouteInterface {
  return ModuleRoute({
    name: 'auth',
    beforeMount: async () => activateFirstChildOf(router, 'auth'),
    afterMount: async () => {
      const isClientFetched = $client.getState().isFetched()
      const accessToken = $accessToken.getState()

      if (!isClientFetched && accessToken) {
        await clientEffects.fetchClient({ accessToken })
      }
    },
    redirects: [
      redirect(
        router,
        async () => {
          const accessToken = $accessToken.getState()

          return !Boolean(accessToken)
        },
        'non-auth',
      ),
    ],
    children,
  })
}

export { getRoute }
