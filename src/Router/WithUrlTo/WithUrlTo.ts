import { fillPathnameWithParams, Params, WithParamsInterface, WithParamsOptions } from '../WithParams'
import { WithPathnameInterface, WithPathnameOptions, getPathnameFromRoutesTrack } from '../WithPathname'
import { Activator, WithActiveInterface, WithActiveOptions, getRoutesTrackByActivator } from '../WithActive'
import { AbstractRoute, WithMapInterface, WithMapOptions } from '../WithMap'
import { WithRootInterface, WithRootOptions } from '../WithRoot'

type RouterComposedOptions = WithParamsOptions &
  WithPathnameOptions &
  WithActiveOptions &
  WithMapOptions &
  WithRootOptions
type RouterComposedInterface = WithParamsInterface &
  WithPathnameInterface &
  WithActiveInterface &
  WithMapInterface &
  WithRootInterface

type WithUrlToOptions = {}

type WithUrlToInterface = {
  urlTo: (activator: Activator, params?: Params) => string | undefined
}

function WithUrlTo<ComposedOptions extends RouterComposedOptions, ComposedInterface extends RouterComposedInterface>(
  createRouter?: (options: ComposedOptions) => ComposedInterface,
) {
  return function (options: WithUrlToOptions & ComposedOptions): WithUrlToInterface & ComposedInterface {
    const composed: ComposedInterface = createRouter?.(options) ?? ({} as ComposedInterface)

    function urlTo(
      this: WithUrlToInterface & ComposedInterface,
      activator: Activator,
      params: Params = [],
    ): string | undefined {
      const urlToTrack: AbstractRoute[] | undefined = getRoutesTrackByActivator(this.getMap(), activator)

      if (urlToTrack != null && urlToTrack.length > 0) {
        if (urlToTrack.some((route) => route.fallback)) {
          return undefined
        }

        const urlToPlainPathname: string = getPathnameFromRoutesTrack(urlToTrack)

        if (params?.length > 0) {
          return fillPathnameWithParams(urlToPlainPathname, params)
        }

        return urlToPlainPathname
      }

      return undefined
    }

    return { ...composed, urlTo }
  }
}

export { WithUrlTo, WithUrlToOptions, WithUrlToInterface, Activator }
