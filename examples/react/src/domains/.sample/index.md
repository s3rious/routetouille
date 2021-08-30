The `domain` is the main unit of the business logic.
The group and the root of all of the routes, stores, views et cetera.

It always should export `getRoute` function that accepts `router` as of `RouterInterface` and `children` as of `AnyRouteInterface[]` if can have any of the subroutes.

All redirect and data fetching logic should be done inside life-cycle methods of the main route: `beforeMount`, `afterMount` and `redirects`.

If the domain has its own `store`, `hooks` or `components` it should be exported from the index as well.

For example:

```typescript
import {
  ModuleRoute,
  ModuleRouteInterface,
  AnyRouteInterface,
  RouterInterface
} from 'services/router'

import { effects } from './store'

function getRoute(
  router: RouterInterface,
  children: AnyRouteInterface[] = []
): ModuleRouteInterface {
  return ModuleRoute({
    name: 'example',
    beforeMount: async () => activateFirstChildOf(router, 'example'),
    redirects: [
      redirect(
        router,
        async () => {
          const state = $accessToken.getState()

          return Boolean(state)
        },
        'other-example',
      ),
    ],
    afterMount: async () => {
      await effects.fetchExample()
    },
    children,
  })
}

export { getRoute }
export * from './store'
export * from './hooks'
export * from './components'
```
