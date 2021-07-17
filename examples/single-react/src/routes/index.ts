import {
  RouteInterface,
  RouteOptions,
  ModuleRouteInterface,
  ModuleRouteOptions,
  FallbackRouteInterface,
  FallbackRouteOptions,
} from 'routetouille'
import { WithReactRootInterface, WithReactRootOptions } from './WithReactRoot'
import { WithReactComponentInterface, WithReactComponentOptions } from './WithReactComponent'

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

export * from './WithReactRoot'
export * from './WithReactComponent'
export { AnyRouteInterface, AnyRouteOptions }
