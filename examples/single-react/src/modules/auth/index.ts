import { redirect, ModuleRoute, ModuleRouteInterface, AnyRouteInterface, RouterInterface } from 'router/index'

function getRoute(router: RouterInterface, children: AnyRouteInterface[] = []): ModuleRouteInterface {
  return ModuleRoute({
    name: 'auth',
    redirects: [
      redirect(
        router,
        async () => {
          const authed = window.localStorage.getItem('authed')

          return authed === 'false' || !Boolean(authed)
        },
        'non-auth',
      ),
    ],
    children,
  })
}

export { getRoute }
