import { Router, BrowserHistory } from 'services/router'

import { getRoute as getRootRoute } from 'domains/root'

import { getRoute as getClientRoute } from 'domains/client'
import { getRoute as getNonAuthRoute } from 'domains/client/domains/non-auth'
import { getRoute as getAuthRoute } from 'domains/client/domains/auth'

import { getRoute as getLogOutRoute } from 'domains/logout'

import { getRoute as getLoginRoute } from 'domains/login'

import { getRoute as getSignUpRoute } from 'domains/signUp'

import { getRoute as getPostsRoute } from 'domains/posts'

import { getRoute as getDashboardRoute } from 'domains/dashboard'

import { getRoute as getFallbackRoute } from 'domains/fallback'

async function main(): Promise<void> {
  const router = Router({
    optimistic: true,
    history: BrowserHistory(),
  })

  router.root = getRootRoute(router, [
    getClientRoute(router, [
      getLogOutRoute(router),
      getNonAuthRoute(router, [getLoginRoute(router), getSignUpRoute(router)]),
      getAuthRoute(router, [getPostsRoute(router, [getDashboardRoute(router)])]),
    ]),
    getFallbackRoute(router),
  ])

  await router.init()
}

void main()
