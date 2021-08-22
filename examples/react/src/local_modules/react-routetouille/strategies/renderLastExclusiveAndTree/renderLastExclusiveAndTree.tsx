import * as React from 'react'
import { ReactElement } from 'react'
import { RouterInterface } from 'routetouille'

import { isWithReactComponent, WithReactComponentInterface } from '../../Route'
import { Context } from '../../Context'

import { renderRecurse } from '../renderRecurse'

type AbstractRouter<Route> = RouterInterface & {
  active: Route[]
}

function findLastIndex<Item extends { [key: string]: unknown }, SearchArray extends Item[]>(
  array: SearchArray,
  searchKey: string,
  searchValue: unknown,
): number {
  const index = [...array].reverse().findIndex((item) => {
    if (Object.prototype.hasOwnProperty.call(item, searchKey)) {
      return item[searchKey] === searchValue
    }

    return false
  })
  const count = array.length - 1

  return index >= 0 ? count - index : index
}

function renderLastExclusiveAndTree<Route extends {}, Router extends AbstractRouter<Route>>(
  router: Router,
  active: Route[],
): ReactElement | null {
  type ReactComponentRoute = Route & WithReactComponentInterface
  let componentRoutes = active.filter(isWithReactComponent) as ReactComponentRoute[]
  const lastExclusiveIndex: number = findLastIndex<ReactComponentRoute, ReactComponentRoute[]>(
    componentRoutes,
    'exclusive',
    true,
  )

  if (lastExclusiveIndex > -1) {
    componentRoutes = componentRoutes.slice(lastExclusiveIndex, componentRoutes.length)
  }

  return <Context.Provider value={{ router }}>{renderRecurse<Router, Route>(router, componentRoutes)}</Context.Provider>
}

export { renderLastExclusiveAndTree }
