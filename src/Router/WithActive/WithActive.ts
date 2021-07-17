import { AbstractRoute, RouteMap, RouteMapRoute, RouteMapKey, WithMapInterface, WithMapOptions } from '../WithMap'
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

function getRoutesTrackByActivator(map: RouteMap, activator: Activator): AbstractRoute[] | undefined {
  const finalRoute = getFinalRouteByActivator(map, activator)

  if (finalRoute != null) {
    return getRoutesTrackByFinalRoute(map, finalRoute)
  }
}

function getFinalRouteByActivator(map: RouteMap, activator: Activator): RouteMapRoute | undefined {
  if (Array.isArray(activator)) {
    activator = activator.map((part) => (part === null ? 'NULL' : part)).join('.')
  }

  if (typeof activator !== 'string') {
    return undefined
  }

  if (activator !== '') {
    const route = map.get(activator)

    if (route != null) {
      return route
    }

    const partialActivator = getActivatorByPartialPath(map, activator)

    if (partialActivator != null) {
      const route = map.get(partialActivator)

      if (route != null) {
        return route
      }
    }

    return getClosestFallbackByActivator(map, activator)
  }

  return getFirstFallback(map)
}

function getActivatorByPartialPath(map: RouteMap, activator: RouteMapKey): string | undefined {
  return [...map.keys()].find((key) => key.includes(activator))
}

function getClosestFallbackByActivator(map: RouteMap, activator: RouteMapKey): RouteMapRoute | undefined {
  const recurse = (arrayOfKeys: RouteMapKey[]): RouteMapRoute | undefined => {
    if (arrayOfKeys.length < 1) {
      return undefined
    }

    const key = arrayOfKeys.join('.')
    const route = map.get(key)

    if (route?.fallback != null) {
      const fallbackRoute = map.get(route.fallback)

      if (fallbackRoute != null) {
        return fallbackRoute
      }
    }

    const nextMaybeKey = arrayOfKeys.splice(0, arrayOfKeys.length - 1)

    return recurse(nextMaybeKey)
  }

  return recurse(activator.split('.')) ?? getFirstFallback(map)
}

function getFirstFallback(map: RouteMap): RouteMapRoute | undefined {
  const root: RouteMapRoute = map.entries().next().value[1]

  const recurse = (route: RouteMapRoute): RouteMapRoute | undefined => {
    if (route.fallback != null) {
      const fallbackRoute = map.get(route.fallback)

      if (fallbackRoute != null) {
        return fallbackRoute
      }
    }

    if (route.children != null) {
      const childRoutes = route.children.map((key) => {
        if (key != null) {
          return map.get(key)
        }

        return undefined
      })

      return childRoutes.map((route) => {
        if (route != null) {
          return recurse(route)
        }

        return undefined
      })[0]
    }
  }

  return recurse(root)
}

function getRoutesTrackByFinalRoute(map: RouteMap, finalRoute: RouteMapRoute): AbstractRoute[] {
  const active: AbstractRoute[] = []

  const recurse = (route: RouteMapRoute): void => {
    active.push(route.route)

    if (route.parent != null) {
      const parent = map.get(route.parent)

      if (parent != null) {
        recurse(parent)
      }
    }
  }

  recurse(finalRoute)

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
      const nextActive = getRoutesTrackByActivator(this.getMap(), activator)

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
