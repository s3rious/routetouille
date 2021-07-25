import {
  ModuleRoute,
  WithEffectorStore,
  WithEffectorStoreInterface,
  ModuleRouteInterface,
  AnyRouteInterface,
  RouterInterface,
} from 'router/index'

import { store, effects, ClientStoreState } from './store'

function getRoute(
  router: RouterInterface,
  children: AnyRouteInterface[] = [],
): WithEffectorStoreInterface<ClientStoreState> & ModuleRouteInterface {
  return WithEffectorStore(ModuleRoute)({
    name: 'client',
    store,
    children,
  })
}

export { getRoute, store, effects }
