import { redirect, Route, RouteInterface, AnyRouteInterface, RouterInterface } from 'router/index'

import { getRoute as getLoginRoute } from './login'
import { getRoute as getSignUpRoute } from './signUp'

function getRoute(router: RouterInterface, children: AnyRouteInterface[] = []): RouteInterface {
  return Route({
    name: 'main',
    path: '/',
    children: [getLoginRoute(router), getSignUpRoute(router), ...children],
    redirects: [
      redirect(
        router,
        async () => {
          const lastActiveRoute = router.active[router.active.length - 1]

          return lastActiveRoute.name === 'main'
        },
        'login',
      ),
    ],
  })
}

export { getRoute }
