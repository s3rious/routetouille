import * as React from 'react'
import { ReactNode } from 'react'

import { isWithReactComponent } from '../Route'

function renderRecurse<Router, Route>(router: Router, routes: Route[], result?: ReactNode): ReactNode | null {
  const [firstRoute, ...restRoutes] = routes

  if (isWithReactComponent(firstRoute)) {
    const Component = firstRoute.component
    const element = <Component route={firstRoute} router={router} />

    if (React.isValidElement(result)) {
      result = React.cloneElement(result, {}, element)
    }

    if (typeof result === 'undefined') {
      result = element
    }
  }

  if (restRoutes.length <= 0) {
    return result ?? null
  }

  return renderRecurse(router, restRoutes, result)
}

export { renderRecurse }
