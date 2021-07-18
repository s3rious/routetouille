import { ModuleRoute, ModuleRouteInterface, RouterInterface } from 'routetouille'

import { AnyRouteInterface } from 'router/routes'
import { redirect } from 'router/redirect'

function getRoute(router: RouterInterface, children: AnyRouteInterface[] = []): ModuleRouteInterface {
  return ModuleRoute({
    name: 'non-auth',
    redirects: [
      redirect(
        router,
        async () => {
          const authed = window.localStorage.getItem('authed')

          return authed === 'true'
        },
        'auth',
      ),
    ],
    children,
  })
}

export { getRoute }
