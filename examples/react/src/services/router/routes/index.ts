import type {
  WithReactComponentInterface,
  WithReactComponentOptions,
  WithReactRootInterface,
  WithReactRootOptions,
} from "react-routetouille/lib/Route";
import type {
  FallbackRouteInterface,
  FallbackRouteOptions,
  ModuleRouteInterface,
  ModuleRouteOptions,
  RouteInterface,
  RouteOptions,
} from "routetouille/lib/Route";

type GenericRouteInterface<Interface> =
  | Interface
  | (WithReactRootInterface & Interface)
  | (WithReactComponentInterface & Interface);

type GenericRouteOptions<Options> =
  | Options
  | (WithReactRootOptions & Options)
  | (WithReactComponentOptions & Options);

type AnyRouteInterface =
  | GenericRouteInterface<RouteInterface>
  | GenericRouteInterface<ModuleRouteInterface>
  | GenericRouteInterface<FallbackRouteInterface>;

type AnyRouteOptions =
  | GenericRouteOptions<RouteOptions>
  | GenericRouteOptions<ModuleRouteOptions>
  | GenericRouteOptions<FallbackRouteOptions>;

export * from "routetouille/lib/Route";
export * from "react-routetouille/lib/Route";
export type { AnyRouteInterface, AnyRouteOptions };
