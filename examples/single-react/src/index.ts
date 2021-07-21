import { Router, BrowserHistory } from 'router/index'

import { getRoute as getRootRoute } from 'modules/root'

import { getRoute as getNonAuthRoute } from 'modules/non-auth'
import { getRoute as getMainRoute } from 'modules/main'

import { getRoute as getAuthRoute } from 'modules/auth'
import { getRoute as getDashboardRoute } from 'modules/dashboard'

import { getRoute as getFallbackRoute } from 'modules/fallback'

async function main(): Promise<void> {
  const router = Router({
    optimistic: true,
    history: BrowserHistory(),
  })

  router.root = getRootRoute(router, [
    getNonAuthRoute(router, [getMainRoute(router, [])]),
    getAuthRoute(router, [getDashboardRoute(router)]),
    getFallbackRoute(router),
  ])

  await router.init()
}

void main()
