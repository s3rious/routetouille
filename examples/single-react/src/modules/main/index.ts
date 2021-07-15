import { AbstractRoute, Route, RouteInterface, RouterInterface } from 'routetouille'

import { getRoute as getLoginRoute } from './login'
import { getRoute as getSignUpRoute } from './signUp'

function getRoute(router: RouterInterface, children: AbstractRoute[] = []): RouteInterface {
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
        async () => await router.goTo('login'),
      ],
    ],
  })
}

export { getRoute }
