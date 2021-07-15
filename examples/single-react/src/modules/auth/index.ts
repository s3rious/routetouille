import { AbstractRoute, ModuleRoute, ModuleRouteInterface, RouterInterface } from 'routetouille'

function getRoute(router: RouterInterface, children: AbstractRoute[] = []): ModuleRouteInterface {
  return ModuleRoute({
    name: 'auth',
    redirects: [
      [
        async () => {
          const authed = window.localStorage.getItem('authed')

          return !Boolean(authed)
        },
        async () => await router.goTo('non-auth'),
      ],
    ],
    children,
  })
}

export { getRoute }
