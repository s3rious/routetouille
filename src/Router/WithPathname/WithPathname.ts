import { Activator, WithActiveInterface, WithActiveOptions } from '../WithActive'
import { AbstractRoute } from '../WithMap'

type WithPathnameOptions = {}

type WithPathnameInterface = WithPathnameOptions & {
  pathname: string | null
  activate: (activator: Activator, optimistic?: boolean) => Promise<void>
}

function getPathnameFromRoutesTrack(track: AbstractRoute[]): string {
  return [...track]
    .map((route) => route.path)
    .filter(Boolean)
    .join('')
    .replace(/^([\w/])/, '/$1')
    .replace(/\/\//g, '/')
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

      this.pathname = getPathnameFromRoutesTrack(this.active)
    }

    return { ...composed, pathname, activate }
  }
}

export { WithPathname, WithPathnameOptions, WithPathnameInterface, getPathnameFromRoutesTrack }
