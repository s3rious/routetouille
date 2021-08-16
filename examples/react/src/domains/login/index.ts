import {
  Route,
  WithReactComponent,
  RouteInterface,
  WithReactComponentInterface,
  RouterInterface,
} from 'services/router'

import { Page } from './components/Page'
import { ForgotPassword } from './components/ForgotPassword'

function getRoute(_router: RouterInterface): WithReactComponentInterface & RouteInterface {
  return WithReactComponent(Route)({
    name: 'login',
    path: 'login/',
    component: Page,
    exclusive: true,
    children: [
      Route({
        name: 'reset-success',
        path: '?resetSuccess',
      }),
      WithReactComponent(Route)({
        name: 'forgot-password',
        path: 'forgot-password/',
        component: ForgotPassword,
      }),
    ],
  })
}

export { getRoute }
