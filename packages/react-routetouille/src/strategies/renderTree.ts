import * as React from 'react'
import { ReactElement } from 'react'
import { RouterInterface } from 'routetouille'

import { isWithReactComponent, WithReactComponentInterface } from '../Route/index.js'
import { Context } from '../Context/index.js'

import { renderRecurse } from './renderRecurse.js'

type AbstractRouter<Route> = RouterInterface & {
  active: Route[]
}

function renderTree<Route extends {}, Router extends AbstractRouter<Route>>(
  router: Router,
  active: Route[],
): ReactElement | null {
  type ReactComponentRoute = Route & WithReactComponentInterface
  const componentRoutes = active.filter(isWithReactComponent) as ReactComponentRoute[]

  return React.createElement(Context.Provider, { value: { router } }, renderRecurse(router, componentRoutes))
}

export { renderTree }
