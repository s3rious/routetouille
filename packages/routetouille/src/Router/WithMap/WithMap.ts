import type { WithRootInterface, WithRootOptions } from "../WithRoot/index.js";
import type {
  FallbackRouteInterface,
  MountableInterface,
  WithChildrenInterface,
  WithNameInterface,
  WithPathInterface,
} from "../../Route/index.js";

type AbstractRoute = WithNameInterface &
  FallbackRouteInterface &
  WithChildrenInterface &
  MountableInterface &
  WithPathInterface;

type WithMapOptions = Record<string, unknown>;

type RouteMapKey = string;

type RouteMapRoute = {
  route: AbstractRoute;
  parent?: RouteMapKey;
  children?: RouteMapKey[];
  fallback?: RouteMapKey;
};
type RouteMap = Map<RouteMapKey, RouteMapRoute>;

type WithMapInterface = WithMapOptions & {
  getMap: () => RouteMap;
};

function extractMapFromRoot(root?: AbstractRoute): RouteMap {
  const map: RouteMap = new Map();

  const recurse = (
    route: AbstractRoute,
    parent?: RouteMapKey,
    fallback?: RouteMapKey,
  ): void => {
    const key: RouteMapKey = (
      parent != null ? [parent, route.name] : [route.name]
    ).join(".");
    const value: RouteMapRoute = {
      route,
    };

    if (parent != null) {
      value.parent = parent;
    }

    if (route?.children != null) {
      value.children = (route.children as AbstractRoute[])
        .map((route) => (route as AbstractRoute).name)
        .map((name: string) => `${key}.${name}`);

      const fallbackSiblingRoute = (route.children as AbstractRoute[]).find(
        (route) => (route as AbstractRoute).fallback,
      ) as AbstractRoute | undefined;

      if (fallbackSiblingRoute?.name != null) {
        fallback = `${key}.${fallbackSiblingRoute.name}`;
      }
    }

    if (fallback != null && route.fallback === undefined) {
      value.fallback = fallback;
    }

    map.set(key, value);

    if (route?.children != null) {
      (route.children as AbstractRoute[]).forEach((route) =>
        recurse(route as AbstractRoute, key, fallback),
      );
    }
  };

  if (root != null) {
    recurse(root);
  }

  return map;
}

function WithMap<
  ComposedOptions extends WithRootOptions,
  ComposedInterface extends WithRootInterface,
>(createRouter?: (options: ComposedOptions) => ComposedInterface) {
  return (
    options: WithMapOptions & ComposedOptions,
  ): WithMapInterface & ComposedInterface => {
    const composed: ComposedInterface =
      createRouter?.(options) ?? ({} as ComposedInterface);
    const cache = new Map();

    function getMap(this: WithMapInterface & ComposedInterface): RouteMap {
      const root = this.root;
      const cached = cache.get(root);

      if (cached) {
        return cached;
      }

      const map = extractMapFromRoot(root as AbstractRoute);
      cache.set(root, map);

      return map;
    }

    return { ...composed, getMap };
  };
}

export {
  WithMap,
  type WithMapOptions,
  type WithMapInterface,
  type AbstractRoute,
  type RouteMap,
  type RouteMapRoute,
  type RouteMapKey,
};
