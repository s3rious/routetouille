import { FunctionComponent } from 'react'
import { RouterInterface } from 'routetouille'

type WithReactComponentProps = {
  route: WithReactComponentInterface
  router: RouterInterface
}

type WithReactComponentOptions = {
  Component: FunctionComponent<WithReactComponentProps>
}

type WithReactComponentInterface = {} & WithReactComponentOptions

function inOperator<K extends string, T extends object>(k: K, o: T): o is T & Record<K, unknown> {
  return k in o
}

function isWithReactComponent(route: unknown): route is WithReactComponentInterface {
  if (typeof route === 'object' && route) {
    if (inOperator('Component', route)) {
      return Boolean(route?.Component)
    }
  }

  return false
}

function WithReactComponent<ComposedOptions extends {}, ComposedInterface extends {}>(
  createRoute: (options: ComposedOptions) => ComposedInterface,
) {
  return function (
    options: WithReactComponentOptions & ComposedOptions,
  ): WithReactComponentInterface & ComposedInterface {
    const composed: ComposedInterface = createRoute(options)

    return { ...composed, Component: options.Component }
  }
}

export {
  WithReactComponent,
  WithReactComponentOptions,
  WithReactComponentInterface,
  WithReactComponentProps,
  isWithReactComponent,
}
