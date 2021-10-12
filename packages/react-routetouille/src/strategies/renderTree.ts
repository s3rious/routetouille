import * as React from 'react'
import { ReactElement } from 'react'
import { RouterInterface } from 'routetouille'

import { isWithReactComponent, WithReactComponentInterface } from '../Route'
import { Context } from '../Context'

import { renderRecurse } from './renderRecurse'

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
