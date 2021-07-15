import { hasParams, extractParams, Params } from '../params'

type Search = `?${string}` | `?${string}=${string}`

type WithSearchOptions = {
  path: Search
}

type WithSearchInterface = WithSearchOptions & {
  match: (path: string) => boolean | Params
}

function isSearch(path: string): path is Search {
  return /^\?/.test(path)
}

function WithSearch<ComposedOptions extends {}, ComposedInterface extends {}>(
  createRoute?: (options: ComposedOptions) => ComposedInterface,
) {
  return function (options: WithSearchOptions & ComposedOptions): WithSearchInterface & ComposedInterface {
    const composed: ComposedInterface = createRoute?.(options) ?? ({} as ComposedInterface)
    const path = options.path
    const withParams = hasParams(path)

    const match = (part: string): boolean | Params => {
      const normalizedPart = part.replace(/^&/, '?')

      if (withParams) {
        return extractParams(path, part)
      }

      return normalizedPart === path
    }

    return { ...composed, path, match }
  }
}

export { Search, isSearch, WithSearch, WithSearchOptions, WithSearchInterface }
