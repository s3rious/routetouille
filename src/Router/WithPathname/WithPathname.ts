import { Activator, WithActiveInterface, WithActiveOptions } from '../WithActive'

type WithPathnameOptions = {}

type WithPathnameInterface = WithPathnameOptions & {
  pathname: string | null
  activate: (activator: Activator, optimistic?: boolean) => Promise<void>
}

function WithPathname<ComposedOptions extends WithActiveOptions, ComposedInterface extends WithActiveInterface>(
  createRouter?: (options: ComposedOptions) => ComposedInterface,
) {
  return function (options: WithPathnameOptions & ComposedOptions): WithPathnameInterface & ComposedInterface {
    const composed: ComposedInterface = createRouter?.(options) ?? ({} as ComposedInterface)
    const pathname: string | null = null

    async function activate(
      this: WithPathnameInterface & ComposedInterface,
      activator: Activator,
      optimistic?: boolean,
    ): Promise<void> {
      await composed.activate.bind(this)(activator, optimistic)

      this.pathname = [...this.active]
        .map((route) => route.path)
        .filter(Boolean)
        .join('')
    }

    return { ...composed, pathname, activate }
  }
}

export { WithPathname, WithPathnameOptions, WithPathnameInterface }
