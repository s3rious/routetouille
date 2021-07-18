import { Route, RouteInterface, RouterInterface } from 'routetouille'

import { AnyRouteInterface } from '../../routes'

import { getRoute as getLoginRoute } from './login'
import { getRoute as getSignUpRoute } from './signUp'

function getRoute(router: RouterInterface, children: AnyRouteInterface[] = []): RouteInterface {
  return Route({
    name: 'main',
    path: '/',
    children: [getLoginRoute(router), getSignUpRoute(router), ...children],
    redirects: [
      [
        async () => {
          const lastActiveRoute = router.active[router.active.length - 1]

          return lastActiveRoute.name === 'main'
        },
        async () => router.goTo('login'),
      ],
    ],
  })
}

export { getRoute }
