import {
  FallbackRoute,
  WithReactComponent,
  FallbackRouteInterface,
  WithReactComponentInterface,
  RouterInterface,
} from 'services/router'

import { Fallback } from './components/Fallback'

function getRoute(_router: RouterInterface): WithReactComponentInterface & FallbackRouteInterface {
  return WithReactComponent(FallbackRoute)({
    name: '404',
    component: Fallback,
  })
}

export { getRoute }
