import { Store } from 'effector'

type WithEffectorStoreOptions<State> = {
  store: Store<State>
}

type WithEffectorStoreInterface<State> = {} & WithEffectorStoreOptions<State>

function inOperator<K extends string, T extends object>(k: K, o: T): o is T & Record<K, unknown> {
  return k in o
}

function isWithEffectorStore(route: unknown): route is WithEffectorStoreInterface<unknown> {
  if (typeof route === 'object' && route) {
    if (inOperator('store', route)) {
      return Boolean(route?.store)
    }
  }

  return false
}

function WithEffectorStore<State, ComposedOptions extends {}, ComposedInterface extends {}>(
  createRoute: (options: ComposedOptions) => ComposedInterface,
) {
  return function (
    options: WithEffectorStoreOptions<State> & ComposedOptions,
  ): WithEffectorStoreInterface<State> & ComposedInterface {
    const composed: ComposedInterface = createRoute(options)

    return { ...composed, store: options.store }
  }
}

export { WithEffectorStore, WithEffectorStoreOptions, WithEffectorStoreInterface, isWithEffectorStore }
