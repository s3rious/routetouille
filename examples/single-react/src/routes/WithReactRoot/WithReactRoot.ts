import * as React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import {
  RouterInterface,
  WithAfterMountInterface,
  WithAfterMountOptions,
  WithAfterUnmountInterface,
  WithAfterUnmountOptions,
} from 'routetouille'

type ComposedRouteOptions = WithAfterMountOptions & WithAfterUnmountOptions
type ComposedRouteInterface = WithAfterMountInterface & WithAfterUnmountInterface

type WithReactRootComponentProps = {
  router: RouterInterface
}

type WithReactRootOptions = {
  id: string
  router: RouterInterface
  Component: React.FunctionComponent<WithReactRootComponentProps>
}

type WithReactRootInterface = {}

function WithReactRoot<ComposedOptions extends ComposedRouteOptions, ComposedInterface extends ComposedRouteInterface>(
  createRoute: (options: ComposedOptions) => ComposedInterface,
) {
  return function (options: WithReactRootOptions & ComposedOptions): WithReactRootInterface & ComposedInterface {
    const { id, router, Component } = options

    async function beforeMount(this: ComposedInterface & ComposedRouteInterface): Promise<void> {
      let root = globalThis.document.getElementById(id)

      if (root == null) {
        const createdRoot = document.createElement('div')
        createdRoot.id = id
        document.body.append(createdRoot)

        root = createdRoot
      }

      render(React.createElement(Component, { router: router }), root)

      await new Promise((resolve) => setTimeout(() => resolve(''), 0))
    }

    async function afterUnmount(this: ComposedInterface & ComposedRouteInterface): Promise<void> {
      const root = document.getElementById(id)

      if (root != null) {
        const parent = root.parentNode

        unmountComponentAtNode(root)

        if (parent != null) {
          parent.removeChild(root)
        }
      }
    }

    const composed: ComposedInterface = createRoute({ ...options, beforeMount, afterUnmount })

    return { ...composed }
  }
}

export { WithReactRoot, WithReactRootOptions, WithReactRootInterface, WithReactRootComponentProps }
