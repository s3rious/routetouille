import { FunctionComponent, ReactChild } from 'react'
import { RouterInterface } from 'routetouille'

type WithReactComponentProps = {
  route: WithReactComponentInterface
  router: RouterInterface
  children?: ReactChild
}

type WithReactComponentOptions = {
  component: FunctionComponent<WithReactComponentProps>
  exclusive?: boolean
}

type WithReactComponentInterface = {} & WithReactComponentOptions

function inOperator<K extends string, T extends object>(k: K, o: T): o is T & Record<K, unknown> {
  return k in o
}

function isWithReactComponent(route: unknown): route is WithReactComponentInterface {
  if (typeof route === 'object' && route) {
    if (inOperator('component', route)) {
      return Boolean(route?.component)
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

    return { ...composed, component: options.component, exclusive: options.exclusive }
  }
}

export {
  WithReactComponent,
  WithReactComponentOptions,
  WithReactComponentInterface,
  WithReactComponentProps,
  isWithReactComponent,
}
