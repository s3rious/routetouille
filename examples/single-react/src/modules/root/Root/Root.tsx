import { useMemo, ReactElement } from 'react'

import { useRouterRoot, renderLastActive, RouterInterface, AnyRouteInterface } from 'router/index'

type RootProps = {
  router: RouterInterface
}

function Root(props: RootProps): ReactElement | null {
  const { router, active } = useRouterRoot<AnyRouteInterface, RouterInterface>(props.router, {
    logger: console,
    verbose: true,
  })
  const hideGUI: boolean = useMemo(() => window.localStorage.getItem('hideGUI') === 'true', [])

  if (hideGUI) {
    return null
  }

  return renderLastActive(router, active)
}

export { Root }
