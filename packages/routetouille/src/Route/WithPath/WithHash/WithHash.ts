import { hasParams, extractParams, Params } from '../params'

type Hash = `#${string}`

type WithHashOptions = {
  path: Hash
}

type WithHashInterface = WithHashOptions & {
  match: (path: string) => boolean | Params
}

function isHash(path: string): path is Hash {
  return /^#/.test(path)
}

function WithHash<ComposedOptions extends {}, ComposedInterface extends {}>(
  createRoute?: (options: ComposedOptions) => ComposedInterface,
) {
  return function (options: WithHashOptions & ComposedOptions): WithHashInterface & ComposedInterface {
    const composed: ComposedInterface = createRoute?.(options) ?? ({} as ComposedInterface)
    const path = options.path
    const withParams = hasParams(path)

    const match = (part: string): boolean | Params => {
      if (withParams) {
        return extractParams(path, part)
      }

      return part === path
    }

    return { ...composed, path, match }
  }
}

export { Hash, isHash, WithHash, WithHashOptions, WithHashInterface }
