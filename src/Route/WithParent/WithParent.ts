type WithParentOptions = {
  parent?: unknown
}

type WithParentInterface = WithParentOptions

function WithParent<ComposedOptions extends {}, ComposedInterface extends {}>(
  createRoute?: (options: ComposedOptions) => ComposedInterface,
) {
  return function (options: WithParentOptions & ComposedOptions): WithParentInterface & ComposedInterface {
    const composed: ComposedInterface = createRoute?.(options) ?? ({} as ComposedInterface)
    const parentRoute = options.parent

    const route: WithParentInterface & ComposedInterface = { ...composed }

    if (Boolean(parentRoute)) {
      route.parent = parentRoute
    }

    return route
  }
}

export { WithParent, WithParentOptions, WithParentInterface }
