/* eslint-disable @typescript-eslint/no-explicit-any */

import { Store } from 'effector'

type WithEffectorStoreOptions<State = unknown> = {
  store: Store<State>
}

type WithEffectorStoreInterface<State = unknown> = {} & WithEffectorStoreOptions<State>

function inOperator<K extends string, T extends object>(k: K, o: T): o is T & Record<K, unknown> {
  return k in o
}

function isWithEffectorStore(route: unknown): route is WithEffectorStoreInterface {
  if (typeof route === 'object' && route) {
    if (inOperator('store', route)) {
      return Boolean(route?.store)
    }
  }

  return false
}

function WithEffectorStore<ComposedOptions extends {}, ComposedInterface extends {}>(
  createRoute: (options: ComposedOptions) => ComposedInterface,
) {
  return function (
    options: WithEffectorStoreOptions<any> & ComposedOptions,
  ): WithEffectorStoreInterface<any> & ComposedInterface {
    const composed: ComposedInterface = createRoute(options)

    return { ...composed, store: options.store }
  }
}

export { WithEffectorStore, WithEffectorStoreOptions, WithEffectorStoreInterface, isWithEffectorStore }
