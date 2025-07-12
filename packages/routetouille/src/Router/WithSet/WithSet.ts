import type {
  WithParamsOptions,
  WithParamsInterface,
} from "../WithParams/index.js";
import type {
  WithPathnameOptions,
  WithPathnameInterface,
} from "../WithPathname/index.js";
import type {
  WithActiveOptions,
  WithActiveInterface,
} from "../WithActive/index.js";
import type {
  WithMapOptions,
  WithMapInterface,
  AbstractRoute,
  RouteMapKey,
  RouteMapRoute,
} from "../WithMap/index.js";

type RouterComposedOptions = WithParamsOptions &
  WithPathnameOptions &
  WithActiveOptions &
  WithMapOptions;
type RouterComposedInterface = WithParamsInterface &
  WithPathnameInterface &
  WithActiveInterface &
  WithMapInterface;

type SetActivator = `/${string}`;

function isActivator(unknown: unknown): unknown is SetActivator {
  if (typeof unknown === "string") {
    return unknown.startsWith("/");
  }

  return false;
}

type WithSetOptions = Record<string, unknown>;
type WithSetInterface = WithSetOptions & {
  set: (path: SetActivator, optimistic?: boolean) => Promise<void>;
};

function getPathParts(path: string, gotSlashRoute: boolean): string[] {
  return path
    .split(/([/?&#])/)
    .filter((part) => part.length > 0)
    .reduce((array: string[], part, index, originalArray) => {
      if (index === 0) {
        array.push(part);
        return array;
      }

      if (index % 2 !== 0) {
        array.push(`${part}${originalArray[index + 1]}`);
        return array;
      }

      return array;
    }, [])
    .filter((part, _index, array) => {
      if (gotSlashRoute) {
        return true;
      }

      if (array.length > 1) {
        return part !== "/";
      }

      return true;
    });
}

function WithSet<
  ComposedOptions extends RouterComposedOptions,
  ComposedInterface extends RouterComposedInterface,
>(createRouter?: (options: ComposedOptions) => ComposedInterface) {
  return (
    options: WithSetOptions & ComposedOptions,
  ): WithSetInterface & ComposedInterface => {
    const composed: ComposedInterface =
      createRouter?.(options) ?? ({} as ComposedInterface);

    async function set(
      this: WithSetInterface & ComposedInterface,
      path: string,
      optimistic?: boolean,
    ): Promise<void> {
      const map = this.getMap();
      const gotSlashRoute =
        [...map.values()].findIndex((route) => route.route.path === "/") > -1;
      const pathParts = getPathParts(path, gotSlashRoute);
      const nextValue = map.entries().next().value;
      if (!nextValue) throw new Error("Map is empty");
      const rootKey: RouteMapKey = nextValue[0];
      const rootRoute: RouteMapRoute | undefined = map.get(rootKey);
      const routesToActive: AbstractRoute[] = [];
      const paramsToActive: Array<{ [key: string]: string }> = [];
      let pathPartIndex = 0;

      if (rootRoute?.route != null) {
        const processParent = (parentKey: RouteMapKey): void => {
          parentKey
            .split(".")
            .map((_, index, array) => array.slice(0, index + 1).join("."))
            .map((routeKey) => map.get(routeKey))
            .filter((mapRoute) => Boolean(mapRoute))
            .forEach((mapRoute) => {
              if (
                mapRoute != null &&
                !routesToActive.includes(mapRoute.route)
              ) {
                routesToActive.push(mapRoute.route);
              }
            });
        };

        const processChild = (childKey: RouteMapKey): void => {
          const childMapRoute = map.get(childKey);

          if (childMapRoute != null) {
            recurse(childMapRoute);
          }
        };

        const recurse = (mapRoute: RouteMapRoute): void => {
          const route = mapRoute.route;

          if (pathPartIndex > pathParts.length - 1) {
            return;
          }

          if (route?.match) {
            const part = pathParts[pathPartIndex];
            const matched = route.match(part);

            if (matched) {
              pathPartIndex = pathPartIndex + 1;

              if (typeof matched !== "boolean") {
                paramsToActive.push(matched);
              }

              if (mapRoute.parent != null) {
                processParent(mapRoute.parent);
              }

              routesToActive.push(route);

              if (mapRoute.children != null) {
                mapRoute.children.forEach(processChild);
                return;
              }
            }

            return;
          }

          if (mapRoute.children != null) {
            mapRoute.children.forEach(processChild);
            return;
          }
        };

        recurse(rootRoute);
      }

      const routesToActiveRegex = new RegExp(
        `^` +
          routesToActive
            .reduce((string, route) => {
              if (route.path) {
                if (route.path.includes(":")) {
                  return (
                    string +
                    route.path.replace(/(:)(\w*)(.*)/, (match, p1, p2) => {
                      return match.replace(p1, "").replace(p2, "\\w*");
                    })
                  );
                }

                return string + route.path;
              }

              return string;
            }, "")
            .replace(/\?/, "\\?") +
          "$",
      );
      const routesToActiveNames: Array<string | null> = routesToActive.map(
        (route) => route.name,
      );
      const isBreak = !routesToActiveRegex.test(pathParts.join(""));

      if (isBreak) {
        routesToActiveNames.push(null);
      }

      await this.activate.bind(this)(
        routesToActiveNames,
        paramsToActive,
        optimistic,
      );

      if (isBreak) {
        this.pathname = path;
      }
    }

    return { ...composed, set };
  };
}

export {
  WithSet,
  type WithSetOptions,
  type WithSetInterface,
  type SetActivator,
  isActivator,
};
