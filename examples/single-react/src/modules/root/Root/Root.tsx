import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { AbstractRoute, RouterInterface } from 'routetouille'

import { WithReactComponentInterface } from '../../../routes/WithReactComponent'

type RootProps = {
  router: RouterInterface
}

function Root({ router }: RootProps): React.ReactElement | null {
  const [active, setActive] = useState(router.active)
  const hideGUI: boolean = useMemo(() => window.localStorage.getItem('hideGUI') === 'true', [])

  useEffect(() => router.on('afterActivate', () => setActive(router.active)), [])

  useEffect(() => console.log('@Root/active', active), [active])

  if (hideGUI) {
    return null
  }

  const Route = router.active[router.active.length - 1] as AbstractRoute & WithReactComponentInterface

  if (Route.Component) {
    return <Route.Component router={router} route={Route} />
  }

  return null
}

export { Root }
