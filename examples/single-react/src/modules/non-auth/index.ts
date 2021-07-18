import { ModuleRoute, ModuleRouteInterface, RouterInterface } from 'routetouille'

import { AnyRouteInterface } from 'router/routes'

function getRoute(router: RouterInterface, children: AnyRouteInterface[] = []): ModuleRouteInterface {
  return ModuleRoute({
    name: 'non-auth',
    redirects: [
      [
        async () => {
          const authed = window.localStorage.getItem('authed')

          return Boolean(authed)
        },
        async () => router.goTo('auth'),
      ],
    ],
    children,
  })
}

export { getRoute }
