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

type AnyRouteInterface =
  | RouteInterface
  | (WithReactRootInterface & RouteInterface)
  | (WithReactComponentInterface & RouteInterface)
  | ModuleRouteInterface
  | (WithReactRootInterface & ModuleRouteInterface)
  | (WithReactComponentInterface & ModuleRouteInterface)
  | FallbackRouteInterface
  | (WithReactRootInterface & FallbackRouteInterface)
  | (WithReactComponentInterface & FallbackRouteInterface)

type AnyRouteOptions =
  | RouteOptions
  | (WithReactRootOptions & RouteOptions)
  | (WithReactComponentOptions & RouteOptions)
  | ModuleRouteOptions
  | (WithReactRootOptions & ModuleRouteOptions)
  | (WithReactComponentOptions & ModuleRouteOptions)
  | FallbackRouteOptions
  | (WithReactRootOptions & FallbackRouteOptions)
  | (WithReactComponentOptions & FallbackRouteOptions)

export * from 'routetouille/lib/Route'
export * from 'local_modules/react-routetouille/Route'
export { AnyRouteInterface, AnyRouteOptions }
