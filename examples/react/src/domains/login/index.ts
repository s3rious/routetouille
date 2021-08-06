import { Route, WithReactComponent, RouteInterface, WithReactComponentInterface, RouterInterface } from 'router/index'

import { Page } from './components/Page'
import { ForgotPassword } from './components/ForgotPassword'

function getRoute(_router: RouterInterface): WithReactComponentInterface & RouteInterface {
  return WithReactComponent(Route)({
    name: 'login',
    path: 'login/',
    exclusive: true,
    component: Page,
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
