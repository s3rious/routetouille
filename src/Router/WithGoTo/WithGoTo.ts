import { WithSetInterface, WithSetOptions, SetActivator, isActivator as isSetActivator } from '../WithSet'
import { Params, WithParamsInterface, WithParamsOptions } from '../WithParams'
import { WithPathnameInterface, WithPathnameOptions } from '../WithPathname'
import { WithActiveInterface, WithActiveOptions, Activator as ActiveActivator } from '../WithActive'
import { WithMapInterface, WithMapOptions } from '../WithMap'

type RouterComposedOptions = WithSetOptions &
  WithParamsOptions &
  WithPathnameOptions &
  WithActiveOptions &
  WithMapOptions
type RouterComposedInterface = WithSetInterface &
  WithParamsInterface &
  WithPathnameInterface &
  WithActiveInterface &
  WithMapInterface

type GoToOptions = {
  params?: Params
  optimistic?: boolean
}

type WithGoToOptions = {}
type WithGoToInterface = WithGoToOptions & {
  goTo: (activator: SetActivator | ActiveActivator, options?: GoToOptions) => Promise<void>
}

function WithGoTo<ComposedOptions extends RouterComposedOptions, ComposedInterface extends RouterComposedInterface>(
  createRouter?: (options: ComposedOptions) => ComposedInterface,
) {
  return function (options: WithGoToOptions & ComposedOptions) {
    const composed: ComposedInterface = createRouter?.(options) ?? ({} as ComposedInterface)

    function goTo(activator: SetActivator, options?: GoToOptions): Promise<void>
    function goTo(activator: ActiveActivator, options?: GoToOptions): Promise<void>
    async function goTo(
      this: WithGoToInterface & ComposedInterface,
      activator: SetActivator | ActiveActivator,
      options?: GoToOptions,
    ): Promise<void> {
      if (isSetActivator(activator)) {
        await this.set(activator, options?.optimistic)
      } else {
        await this.activate(activator, options?.params ?? [], options?.optimistic)
      }
    }

    return { ...composed, goTo }
  }
}

export { WithGoTo, WithGoToOptions, WithGoToInterface, GoToOptions }
