import * as React from 'react'
import { ReactElement } from 'react'
import { RouterInterface } from 'routetouille'

import { isWithReactComponent } from '../Route'
import { Context } from '../Context'

type AbstractRouter<Route> = RouterInterface & {
  active: Route[]
}

function renderLastActive<Route extends {}, Router extends AbstractRouter<Route>>(
  router: Router,
  active: Route[],
): ReactElement | null {
  const route = active[active.length - 1]

  if (isWithReactComponent(route)) {
    const Component = route.component

    return React.createElement(
      Context.Provider,
      { value: { router } },
      React.createElement(Component, { router, route }),
    )
  }

  return null
}

export { renderLastActive }
