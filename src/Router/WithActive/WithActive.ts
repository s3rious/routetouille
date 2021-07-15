import { AbstractRoute, RouteMap, RouteMapElement, RouteMapKey, WithMapInterface, WithMapOptions } from '../WithMap'
import { WithRootInterface, WithRootOptions } from '../WithRoot'

type RouterComposedOptions = WithMapOptions & WithRootOptions
type RouterComposedInterface = WithMapInterface & WithRootInterface

type Activator = RouteMapKey | Array<RouteMapKey | null>

type WithActiveOptions = {
  optimistic?: true
}

type WithActiveInterface = WithActiveOptions & {
  active: AbstractRoute[]
  activate: (activator: Activator, optimistic?: boolean) => Promise<void>
}

function getNextActive(map: RouteMap, activator: Activator): AbstractRoute[] | undefined {
  const endElementToActivate = getEndElementToActivate(map, activator)

  if (endElementToActivate != null) {
    return getNextActiveFromEndElement(map, endElementToActivate)
  }
}

function getEndElementToActivate(map: RouteMap, activator: Activator): RouteMapElement | undefined {
  if (Array.isArray(activator)) {
    activator = activator.map((part) => (part === null ? 'NULL' : part)).join('.')
  }

  if (typeof activator !== 'string') {
    return undefined
  }

  if (activator !== '') {
    const element = map.get(activator)

    if (element != null) {
      return element
    }

    const partialActivator = getActivatorFromPartial(map, activator)

    if (partialActivator != null) {
      const element = map.get(partialActivator)

      if (element != null) {
        return element
      }
    }

    return getClosestFallback(map, activator)
  }

  return getFirstFallback(map)
}

function getActivatorFromPartial(map: RouteMap, activator: RouteMapKey): string | undefined {
  return [...map.keys()].find((key) => key.includes(activator))
}

function getClosestFallback(map: RouteMap, activator: RouteMapKey): RouteMapElement | undefined {
  const recurse = (arrayOfKeys: RouteMapKey[]): RouteMapElement | undefined => {
    if (arrayOfKeys.length < 1) {
      return undefined
    }

    const key = arrayOfKeys.join('.')
    const element = map.get(key)

    if (element?.fallback != null) {
      const fallbackElement = map.get(element.fallback)

      if (fallbackElement != null) {
        return fallbackElement
      }
    }

    const nextMaybeKey = arrayOfKeys.splice(0, arrayOfKeys.length - 1)

    return recurse(nextMaybeKey)
  }

  return recurse(activator.split('.')) ?? getFirstFallback(map)
}

function getFirstFallback(map: RouteMap): RouteMapElement | undefined {
  const firstElement: RouteMapElement = map.entries().next().value[1]

  const recurse = (element: RouteMapElement): RouteMapElement | undefined => {
    if (element.fallback != null) {
      const fallbackElement = map.get(element.fallback)

      if (fallbackElement != null) {
        return fallbackElement
      }
    }

    if (element.children != null) {
      const childElements = element.children.map((key) => {
        if (key != null) {
          return map.get(key)
        }

        return undefined
      })

      return childElements.map((element) => {
        if (element != null) {
          return recurse(element)
        }

        return undefined
      })[0]
    }
  }

  return recurse(firstElement)
}

function getNextActiveFromEndElement(map: RouteMap, endElement: RouteMapElement): AbstractRoute[] {
  const active: AbstractRoute[] = []

  const recurse = (element: RouteMapElement): void => {
    active.push(element.route)

    if (element.parent != null) {
      const parentElement = map.get(element.parent)

      if (parentElement != null) {
        recurse(parentElement)
      }
    }
  }

  recurse(endElement)

  return active.reverse()
}

function getRoutesToUnmount(currentActive: AbstractRoute[], nextActive: AbstractRoute[]): AbstractRoute[] {
  return currentActive.filter((route) => !nextActive.includes(route))
}

function getRoutesToMount(currentActive: AbstractRoute[], nextActive: AbstractRoute[]): AbstractRoute[] {
  const sameBetweenCurrentAndNext = currentActive.filter((route) => nextActive.includes(route))
  return nextActive.filter((route) => !sameBetweenCurrentAndNext.includes(route))
}

async function performActionToRoutes(routes: AbstractRoute[], action: 'mount' | 'unmount'): Promise<AbstractRoute[]> {
  for (const route of routes) {
    await route[action]()
  }

  return routes
}

function isEveryRouteMounted(routes: AbstractRoute[]): boolean {
  return routes.map((route) => route.mounted).every((mounted) => mounted)
}

async function performUnmountMount(
  currentActive: AbstractRoute[],
  nextActive: AbstractRoute[],
): Promise<AbstractRoute[]> {
  const routesToUnmount = getRoutesToUnmount(currentActive, nextActive)
  const routesToMount = getRoutesToMount(currentActive, nextActive)

  await performActionToRoutes(routesToUnmount, 'unmount')
  return await performActionToRoutes(routesToMount, 'mount')
}

function WithActive<ComposedOptions extends RouterComposedOptions, ComposedInterface extends RouterComposedInterface>(
  createRouter?: (options: ComposedOptions) => ComposedInterface,
) {
  return function (options: WithActiveOptions & ComposedOptions): WithActiveInterface & ComposedInterface {
    const composed: ComposedInterface = createRouter?.(options) ?? ({} as ComposedInterface)
    const active: AbstractRoute[] = []

    async function activate(
      this: WithActiveInterface & ComposedInterface,
      activator: Activator,
      optimistic?: boolean,
    ): Promise<void> {
      const isOptimistic: boolean = Boolean(typeof optimistic === 'boolean' ? optimistic : options.optimistic)
      const currentActive = [...this.active]
      const nextActive = getNextActive(this.getMap(), activator)

      if (nextActive != null) {
        if (isOptimistic) {
          this.active = nextActive

          // move to next tick
          setTimeout(() => {
            void performUnmountMount(currentActive, nextActive)
          }, 0)

          return
        }

        const routesAfterMount = await performUnmountMount(currentActive, nextActive)

        if (isEveryRouteMounted(routesAfterMount)) {
          this.active = nextActive
        }
      }
    }

    return { ...composed, active, activate }
  }
}

export { WithActive, WithActiveOptions, WithActiveInterface, Activator }
