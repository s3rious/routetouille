type WithNameOptions = {
  name: string
}

type WithNameInterface = WithNameOptions

function WithName<ComposedOptions extends {}, ComposedInterface extends {}>(
  createRoute?: (options: ComposedOptions) => ComposedInterface,
) {
  return function (options: WithNameOptions & ComposedOptions): WithNameInterface & ComposedInterface {
    const composed: ComposedInterface = createRoute?.(options) ?? ({} as ComposedInterface)
    const name = options.name

    return { ...composed, name }
  }
}

export { WithName, WithNameOptions, WithNameInterface }
