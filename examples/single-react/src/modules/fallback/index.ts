import {
  FallbackRoute,
  WithReactComponent,
  FallbackRouteInterface,
  WithReactComponentInterface,
  RouterInterface,
} from 'router/index'

import { Fallback } from './Fallback'

function getRoute(_router: RouterInterface): WithReactComponentInterface & FallbackRouteInterface {
  return WithReactComponent(FallbackRoute)({
    name: '404',
    Component: Fallback,
  })
}

export { getRoute }
