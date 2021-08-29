import { useCallback, useEffect, useState } from 'react'
import { RouterInterface, isGoToState } from 'routetouille'

type AbstractRouter<Route> = {
  active: Route[]
} & RouterInterface

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

  const handleHistoryChange = useCallback((_pathname: string, state: unknown) => {
    if (isGoToState(state)) {
      globalThis.scrollTo(0, state.scrollTop)

      // move to next tick
      setTimeout(() => globalThis.scrollTo(0, state.scrollTop), 0)
    }
  }, [])

  const handleAfterActivate = useCallback(() => setActive(router.active), [])

  useEffect(() => {
    if (router.history?.emitter) {
      router.history.emitter.on('change', handleHistoryChange)
    }

    router.on('afterActivate', handleAfterActivate)
  }, [])

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
