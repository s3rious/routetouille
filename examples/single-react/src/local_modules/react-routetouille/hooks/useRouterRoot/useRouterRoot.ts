import { useEffect, useState } from 'react'

type AbstractRouter<Route> = {
  active: Route[]
  on: (event: 'afterActivate', callback: (routes: Route[]) => void) => void
}

type UseRouterRootOptions = {
  logger?: Console
  verbose?: boolean
}

function useRouterRoot<Route extends {}, Router extends AbstractRouter<Route>>(
  router: Router,
  { logger, verbose }: UseRouterRootOptions = {},
): {
  router: Router
  active: Route[]
} {
  const [active, setActive] = useState<Route[]>(router.active)

  useEffect(() => router.on('afterActivate', () => setActive(router.active)), [])
  useEffect(() => {
    if (logger && verbose) {
      logger.info('@Root/active', active)
    }
  }, [logger, verbose, active])

  return {
    router,
    active,
  }
}

export { useRouterRoot }
