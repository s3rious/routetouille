type WithRootOptions = {
  root?: unknown
}

type WithRootInterface = WithRootOptions

function WithRoot<ComposedOptions extends {}, ComposedInterface extends {}>(
  createRouter?: (options: ComposedOptions) => ComposedInterface,
) {
  return function (options: WithRootOptions & ComposedOptions): WithRootInterface & ComposedInterface {
    const composed: ComposedInterface = createRouter?.(options) ?? ({} as ComposedInterface)
    const root = options.root

    return { ...composed, root }
  }
}

export { WithRoot, WithRootOptions, WithRootInterface }
