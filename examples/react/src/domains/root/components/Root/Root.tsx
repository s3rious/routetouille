import { useMemo, ReactElement } from 'react'

import { useRouterRoot, renderLastExclusiveAndTree, RouterInterface, AnyRouteInterface } from 'services/router'

import './Root.css'
import 'components/atoms/Palette/Palette.css'

type RootProps = {
  router: RouterInterface
}

function Root(props: RootProps): ReactElement | null {
  const { router, active } = useRouterRoot<AnyRouteInterface, RouterInterface>(props.router, {
    logger: console,
    verbose: true,
  })
  const hideGUI: boolean = useMemo(() => globalThis.localStorage.getItem('HIDE_GUI') === 'true', [])

  if (hideGUI) {
    return null
  }

  return renderLastExclusiveAndTree(router, active)
}

export { Root }
