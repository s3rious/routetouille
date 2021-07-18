import * as React from 'react'
import { RouterInterface } from 'routetouille'

type WithReactComponentProps = {
  route: WithReactComponentInterface
  router: RouterInterface
}

type WithReactComponentOptions = {
  Component: React.FunctionComponent<WithReactComponentProps>
}

type WithReactComponentInterface = {} & WithReactComponentOptions

function isWithReactComponent(route: unknown): route is WithReactComponentInterface {
  if (typeof route === 'object') {
    // TODO: Fix
    // @ts-expect-error
    return Boolean(route?.Component)
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
