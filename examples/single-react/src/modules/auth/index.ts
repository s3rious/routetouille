import { ModuleRoute, ModuleRouteInterface, RouterInterface } from 'routetouille'

import { AnyRouteInterface } from '../../routes'

function getRoute(router: RouterInterface, children: AnyRouteInterface[] = []): ModuleRouteInterface {
  return ModuleRoute({
    name: 'auth',
    redirects: [
      [
        async () => {
          const authed = window.localStorage.getItem('authed')

          return !Boolean(authed)
        },
        async () => router.goTo('non-auth'),
      ],
    ],
    children,
  })
}

export { getRoute }
