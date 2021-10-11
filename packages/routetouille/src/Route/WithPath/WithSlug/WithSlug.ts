import { hasParams, extractParams, Params } from '../params'

type Slug = `${string}/`

type WithSlugOptions = {
  path: Slug
}

type WithSlugInterface = WithSlugOptions & {
  match: (path: string) => boolean | Params
}

function isSlug(path: string): path is Slug {
  return /\/$/.test(path)
}

function WithSlug<ComposedOptions extends {}, ComposedInterface extends {}>(
  createRoute?: (options: ComposedOptions) => ComposedInterface,
) {
  return function (options: WithSlugOptions & ComposedOptions): WithSlugInterface & ComposedInterface {
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

export { Slug, isSlug, WithSlug, WithSlugOptions, WithSlugInterface }
