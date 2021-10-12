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
} from 'react-routetouille/lib/Route'

type GenericRouteInterface<Interface> =
  | Interface
  | (WithReactRootInterface & Interface)
  | (WithReactComponentInterface & Interface)

type GenericRouteOptions<Options> = Options | (WithReactRootOptions & Options) | (WithReactComponentOptions & Options)

type AnyRouteInterface =
  | GenericRouteInterface<RouteInterface>
  | GenericRouteInterface<ModuleRouteInterface>
  | GenericRouteInterface<FallbackRouteInterface>

type AnyRouteOptions =
  | GenericRouteOptions<RouteOptions>
  | GenericRouteOptions<ModuleRouteOptions>
  | GenericRouteOptions<FallbackRouteOptions>

export * from 'routetouille/lib/Route'
export * from 'react-routetouille/lib/Route'
export { AnyRouteInterface, AnyRouteOptions }
