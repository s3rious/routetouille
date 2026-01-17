import {
  fillPathnameWithParams,
  type Params,
  type WithParamsInterface,
  type WithParamsOptions,
} from "../WithParams/index.js";
import {
  type WithPathnameInterface,
  type WithPathnameOptions,
  getPathnameFromRoutesTrack,
} from "../WithPathname/index.js";
import {
  Activator,
  type WithActiveInterface,
  type WithActiveOptions,
  getRoutesTrackByActivator,
} from "../WithActive/index.js";
import type {
  AbstractRoute,
  WithMapInterface,
  WithMapOptions,
} from "../WithMap/index.js";
import type { WithRootInterface, WithRootOptions } from "../WithRoot/index.js";

type RouterComposedOptions = WithParamsOptions &
  WithPathnameOptions &
  WithActiveOptions &
  WithMapOptions &
  WithRootOptions;
type RouterComposedInterface = WithParamsInterface &
  WithPathnameInterface &
  WithActiveInterface &
  WithMapInterface &
  WithRootInterface;

type WithUrlToOptions = Record<string, unknown>;

type WithUrlToInterface = {
  urlTo: (activator: Activator, params?: Params) => string | undefined;
};

function WithUrlTo<
  ComposedOptions extends RouterComposedOptions,
  ComposedInterface extends RouterComposedInterface,
>(createRouter?: (options: ComposedOptions) => ComposedInterface) {
  return (
    options: WithUrlToOptions & ComposedOptions,
  ): WithUrlToInterface & ComposedInterface => {
    const composed: ComposedInterface =
      createRouter?.(options) ?? ({} as ComposedInterface);

    function urlTo(
      this: WithUrlToInterface & ComposedInterface,
      activator: Activator,
      params: Params = [],
    ): string | undefined {
      const urlToTrack: AbstractRoute[] | undefined = getRoutesTrackByActivator(
        this.getMap(),
        activator,
      );

      if (urlToTrack != null && urlToTrack.length > 0) {
        if (urlToTrack.some((route) => route.fallback)) {
          return undefined;
        }

        const urlToPlainPathname: string =
          getPathnameFromRoutesTrack(urlToTrack);

        if (params?.length > 0) {
          return fillPathnameWithParams(urlToPlainPathname, params);
        }

        return urlToPlainPathname;
      }

      return undefined;
    }

    return { ...composed, urlTo };
  };
}

export { WithUrlTo, type WithUrlToOptions, type WithUrlToInterface, Activator };
