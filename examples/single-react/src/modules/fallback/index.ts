import { FallbackRoute, FallbackRouteInterface, RouterInterface } from 'routetouille'

import { WithReactComponent, WithReactComponentInterface } from 'router/routes'

import { Fallback } from './Fallback'

function getRoute(_router: RouterInterface): WithReactComponentInterface & FallbackRouteInterface {
  return WithReactComponent(FallbackRoute)({
    name: '404',
    Component: Fallback,
  })
}

export { getRoute }
