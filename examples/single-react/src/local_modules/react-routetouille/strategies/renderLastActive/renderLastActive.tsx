import * as React from 'react'
import { ReactElement } from 'react'
import { isWithReactComponent } from '../../Route'
import { Context } from '../../Context'

type AbstractRouter<Route> = {
  active: Route[]
}

function renderLastActive<Route extends {}, Router extends AbstractRouter<Route>>(
  router: Router,
  active: Route[],
): ReactElement | null {
  const route = active[active.length - 1]

  if (isWithReactComponent(route)) {
    const Component = route.component

    return (
      <Context.Provider value={{ router }}>
        <Component router={router} route={route} />
      </Context.Provider>
    )
  }

  return null
}

export { renderLastActive }
