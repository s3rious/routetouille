import {
  RouteInterface,
  RouteOptions,
  ModuleRouteInterface,
  ModuleRouteOptions,
  FallbackRouteInterface,
  FallbackRouteOptions,
} from 'routetouille/lib/Route'
import {
  WithReactRootInterface,
  WithReactRootOptions,
  WithReactComponentInterface,
  WithReactComponentOptions,
} from 'local_modules/react-routetouille/Route'
import { WithEffectorStoreInterface, WithEffectorStoreOptions } from 'local_modules/effector-routetouille/Route'

type GenericRouteInterface<Interface, State extends unknown> =
  | Interface
  | (WithReactRootInterface & Interface)
  | (WithReactComponentInterface & Interface)
  | (WithEffectorStoreInterface<State> & Interface)
  | (WithEffectorStoreInterface<State> & WithReactRootInterface & Interface)
  | (WithEffectorStoreInterface<State> & WithReactComponentInterface & Interface)

type GenericRouteOptions<Options, State extends unknown> =
  | Options
  | (WithReactRootOptions & Options)
  | (WithReactComponentOptions & Options)
  | (WithEffectorStoreOptions<State> & Options)
  | (WithEffectorStoreOptions<State> & WithReactRootOptions & Options)
  | (WithEffectorStoreOptions<State> & WithReactComponentOptions & Options)

type AnyRouteInterface<State = unknown> =
  | GenericRouteInterface<RouteInterface, State>
  | GenericRouteInterface<ModuleRouteInterface, State>
  | GenericRouteInterface<FallbackRouteInterface, State>

type AnyRouteOptions<State = unknown> =
  | GenericRouteOptions<RouteOptions, State>
  | GenericRouteOptions<ModuleRouteOptions, State>
  | GenericRouteOptions<FallbackRouteOptions, State>

export * from 'routetouille/lib/Route'
export * from 'local_modules/react-routetouille/Route'
export * from 'local_modules/effector-routetouille/Route'
export { AnyRouteInterface, AnyRouteOptions }
