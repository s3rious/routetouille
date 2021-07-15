import * as React from 'react'
import { RouterInterface } from 'routetouille'

type ComponentProps = {
  route: WithReactComponentInterface
  router: RouterInterface
}

type WithReactComponentOptions = {
  Component: React.FunctionComponent<ComponentProps>
}

type WithReactComponentInterface = {} & WithReactComponentOptions

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

export { WithReactComponent, WithReactComponentOptions, WithReactComponentInterface, ComponentProps }
