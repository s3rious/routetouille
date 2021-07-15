type WithChildrenOptions = {
  children?: unknown[]
}

type WithChildrenInterface = WithChildrenOptions

function WithChildren<ComposedOptions extends {}, ComposedInterface extends {}>(
  createRoute?: (options: ComposedOptions) => ComposedInterface,
) {
  return function (options: WithChildrenOptions & ComposedOptions): WithChildrenInterface & ComposedInterface {
    const composed: ComposedInterface = createRoute?.(options) ?? ({} as ComposedInterface)
    const children = options.children

    const route: WithChildrenInterface & ComposedInterface = { ...composed }

    if (children != null) {
      route.children = children
    }

    return route
  }
}

export { WithChildren, WithChildrenOptions, WithChildrenInterface }
