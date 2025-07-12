import { StrictMode, createElement, FunctionComponent } from 'react'
import * as ReactDOM from 'react-dom'
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
  beforeMount?: () => Promise<void>
  afterMount?: () => Promise<void>
  afterUnmount?: () => Promise<void>
  id: string
  preloaderId?: string
  router: RouterInterface
  component: FunctionComponent<WithReactRootComponentProps>
}

type WithReactRootInterface = {}

async function waitATick(): Promise<void> {
  return await new Promise(function (resolve) {
    setTimeout(resolve, 0)
  })
}

function WithReactRoot<ComposedOptions extends ComposedRouteOptions, ComposedInterface extends ComposedRouteInterface>(
  createRoute: (options: ComposedOptions) => ComposedInterface,
) {
  return function (options: WithReactRootOptions & ComposedOptions): WithReactRootInterface & ComposedInterface {
    const {
      id,
      preloaderId,
      router,
      beforeMount: composedBeforeMount,
      afterMount: composedAfterMount,
      afterUnmount: composedAfterUnmount,
      component: Component,
    } = options

    async function beforeMount(this: ComposedInterface & ComposedRouteInterface): Promise<void> {
      if (composedBeforeMount) {
        await composedBeforeMount()
      }

      await waitATick()

      let container = globalThis.document.getElementById(id)

      if (container == null) {
        const createdRoot = globalThis.document.createElement('div')
        createdRoot.id = id
        globalThis.document.body.append(createdRoot)

        container = createdRoot
      }

      const reactApp = createElement(StrictMode, null, createElement(Component, { router: router }))

      // Try to import createRoot type from react-dom/client if available
      let hasCreateRoot = false
      let createRoot: ((container: Element | DocumentFragment) => { render: (node: React.ReactNode) => void }) | undefined
      if (!(globalThis as any).__TEST_DISABLE_CREATE_ROOT__) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          createRoot = require('react-dom/client').createRoot
          hasCreateRoot = typeof createRoot === 'function'
        } catch {}
      }

      if (hasCreateRoot && createRoot) {
        const root = createRoot(container)
        root.render(reactApp)
        return
      }

      // Legacy ReactDOM.render fallback (only for React 17 and below)
      ;(ReactDOM as any).render(reactApp, container)
    }

    async function afterMount(this: ComposedInterface & ComposedRouteInterface): Promise<void> {
      if (preloaderId) {
        const preloader = globalThis.document.getElementById(preloaderId)

        if (preloader != null) {
          const parent = preloader.parentNode

          if (parent != null) {
            parent.removeChild(preloader)
          }
        }
      }

      if (composedAfterMount) {
        await composedAfterMount()
      }
    }

    async function afterUnmount(this: ComposedInterface & ComposedRouteInterface): Promise<void> {
      const root = globalThis.document.getElementById(id)

      if (root != null) {
        const parent = root.parentNode as (Node & { removeChild(node: Node): void }) | null
        (ReactDOM as any).unmountComponentAtNode(root)
        if (parent != null) {
          parent.removeChild(root)
        }
      }

      if (composedAfterUnmount) {
        await composedAfterUnmount()
      }
    }

    const composed: ComposedInterface = createRoute({ ...options, beforeMount, afterMount, afterUnmount })

    return { ...composed }
  }
}

export { WithReactRoot, WithReactRootOptions, WithReactRootInterface, WithReactRootComponentProps }
