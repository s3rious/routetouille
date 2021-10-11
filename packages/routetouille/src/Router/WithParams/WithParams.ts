import { WithPathnameInterface, WithPathnameOptions } from '../WithPathname'
import { Activator, WithActiveInterface, WithActiveOptions } from '../WithActive'

type RouterComposedOptions = WithPathnameOptions & WithActiveOptions
type RouterComposedInterface = WithPathnameInterface & WithActiveInterface

type Params = Array<{ [key: string]: string }>

type WithParamsOptions = {}
type WithParamsInterface = WithParamsOptions & {
  params: Params
  activate: (activator: Activator, params: Params, optimistic?: boolean) => Promise<void>
}

function fillPathnameWithParams(pathname: string, params: Params): string {
  let newPathname = pathname

  if (params.length > 0) {
    params.forEach((param) => {
      const [key, value] = Object.entries(param)[0]
      const nextPathname = newPathname.replace(new RegExp(`:${key}`), value)

      if (nextPathname !== '') {
        newPathname = nextPathname
      }
    })
  }

  return newPathname
}

function WithParams<ComposedOptions extends RouterComposedOptions, ComposedInterface extends RouterComposedInterface>(
  createRouter?: (options: ComposedOptions) => ComposedInterface,
) {
  return function (options: WithParamsOptions & ComposedOptions): WithParamsInterface & ComposedInterface {
    const composed: ComposedInterface = createRouter?.(options) ?? ({} as ComposedInterface)
    const pathname = composed.pathname
    const params: Params = []

    async function activate(
      this: WithParamsInterface & ComposedInterface,
      activator: Activator,
      params: Params = [],
      optimistic?: boolean,
    ): Promise<void> {
      await composed.activate.bind(this)(activator, optimistic)
      this.params = params

      if (typeof this.pathname === 'string') {
        this.pathname = fillPathnameWithParams(this.pathname, this.params)
      }
    }

    return { ...composed, pathname, params, activate }
  }
}

export { WithParams, WithParamsOptions, WithParamsInterface, Params, fillPathnameWithParams }
