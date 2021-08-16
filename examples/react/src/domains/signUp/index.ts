import {
  Route,
  WithReactComponent,
  RouteInterface,
  WithReactComponentInterface,
  RouterInterface,
} from 'services/router'

import { Page } from './components/Page'

function getRoute(_router: RouterInterface): WithReactComponentInterface & RouteInterface {
  return WithReactComponent(Route)({
    name: 'sign-up',
    path: 'sign-up/',
    exclusive: true,
    component: Page,
  })
}

export { getRoute }
