import { redirect, ModuleRoute, ModuleRouteInterface, AnyRouteInterface, RouterInterface } from 'router/index'

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
