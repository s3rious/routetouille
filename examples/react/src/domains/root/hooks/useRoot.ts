import { ReactElement, useCallback } from 'react'
import { renderLastExclusiveAndTree, useRouterRoot } from 'local_modules/react-routetouille'
import { useStore } from 'effector-react'

import { AnyRouteInterface, RouterInterface } from 'services/router'

import { $hideGui } from 'domains/root'

type UseRootInterface = {
  render: () => ReactElement | null
}

function useRoot(routerProp: RouterInterface): UseRootInterface {
  const { router, active } = useRouterRoot<AnyRouteInterface, RouterInterface>(routerProp)
  const hideGUI = useStore($hideGui)

  const render = useCallback(() => {
    if (hideGUI) {
      return null
    }

    return renderLastExclusiveAndTree(router, active)
  }, [router, active, hideGUI])

  return { render }
}

export { useRoot }
