import { FallbackRoute, FallbackInterface, RouterInterface } from 'routetouille'

import { WithReactComponent, WithReactComponentInterface } from '../../routes/WithReactComponent'

import { Fallback } from './Fallback'

function getRoute(_router: RouterInterface): WithReactComponentInterface & FallbackInterface {
  return WithReactComponent(FallbackRoute)({
    name: '404',
    Component: Fallback,
  })
}

export { getRoute }
