import { WithParamsInterface, WithParamsOptions } from '../WithParams'
import { WithPathnameInterface, WithPathnameOptions } from '../WithPathname'
import { WithActiveInterface, WithActiveOptions } from '../WithActive'
import { WithMapInterface, WithMapOptions, RouteMapRoute, RouteMapKey, AbstractRoute } from '../WithMap'

type RouterComposedOptions = WithParamsOptions & WithPathnameOptions & WithActiveOptions & WithMapOptions
type RouterComposedInterface = WithParamsInterface & WithPathnameInterface & WithActiveInterface & WithMapInterface

type SetActivator = `/${string}`

function isActivator(unknown: unknown): unknown is SetActivator {
  if (typeof unknown === 'string') {
    return unknown.startsWith('/')
  }

  return false
}

type WithSetOptions = {}
type WithSetInterface = WithSetOptions & {
  set: (path: SetActivator, optimistic?: boolean) => Promise<void>
}

function getPathParts(path: string, gotSlashRoute: boolean): string[] {
  return path
    .split(/([/?&#])/)
    .filter((part) => part.length > 0)
    .reduce((array: string[], part, index, originalArray) => {
      if (index === 0) {
        return [...array, part]
      }

      if (index % 2 !== 0) {
        return [...array, `${part}${originalArray[index + 1]}`]
      }

      return array
    }, [])
    .filter((part, index, array) => {
      if (gotSlashRoute) {
        return true
      }

      if (array.length > 1) {
        return part !== '/'
      }

      return true
    })
}

function WithSet<ComposedOptions extends RouterComposedOptions, ComposedInterface extends RouterComposedInterface>(
  createRouter?: (options: ComposedOptions) => ComposedInterface,
) {
  return function (options: WithSetOptions & ComposedOptions): WithSetInterface & ComposedInterface {
    const composed: ComposedInterface = createRouter?.(options) ?? ({} as ComposedInterface)

    async function set(this: WithSetInterface & ComposedInterface, path: string, optimistic?: boolean): Promise<void> {
      const map = this.getMap()
      const gotSlashRoute = [...map.values()].findIndex((route) => route.route.path === '/') > -1
      const pathParts = getPathParts(path, gotSlashRoute)
      const rootKey: RouteMapKey = map.entries().next().value[0]
      const rootRoute: RouteMapRoute | undefined = map.get(rootKey)
      const routesToActive: AbstractRoute[] = []
      const paramsToActive: Array<{ [key: string]: string }> = []
      let pathPartIndex = 0

      if (rootRoute?.route != null) {
        const processParent = (parentKey: RouteMapKey): void => {
          parentKey
            .split('.')
            .map((_, index, array) => array.slice(0, index + 1).join('.'))
            .map((routeKey) => map.get(routeKey))
            .filter((mapRoute) => Boolean(mapRoute))
            .forEach((mapRoute) => {
              if (mapRoute != null && !routesToActive.includes(mapRoute.route)) {
                routesToActive.push(mapRoute.route)
              }
            })
        }

        const processChild = (childKey: RouteMapKey): void => {
          const childMapRoute = map.get(childKey)

          if (childMapRoute != null) {
            return recurse(childMapRoute)
          }
        }

        const recurse = (mapRoute: RouteMapRoute): void => {
          const route = mapRoute.route

          if (pathPartIndex > pathParts.length - 1) {
            return
          }

          if (Boolean(route?.match)) {
            const part = pathParts[pathPartIndex]
            const matched = route.match(part)

            if (Boolean(matched)) {
              pathPartIndex = pathPartIndex + 1

              if (typeof matched !== 'boolean') {
                paramsToActive.push(matched)
              }

              if (mapRoute.parent != null) {
                processParent(mapRoute.parent)
              }

              routesToActive.push(route)

              if (mapRoute.children != null) {
                return mapRoute.children.forEach(processChild)
              }
            }

            return
          }

          if (mapRoute.children != null) {
            return mapRoute.children.forEach(processChild)
          }
        }

        recurse(rootRoute)
      }

      const routesToActiveRegex = new RegExp(
        `^` +
          routesToActive
            .reduce((string, route) => {
              if (Boolean(route.path)) {
                if (route.path.includes(':')) {
                  return (
                    string +
                    route.path.replace(/(:)(\w*)(.*)/, (match, p1, p2) => {
                      return match.replace(p1, '').replace(p2, '\\w*')
                    })
                  )
                }

                return string + route.path
              }

              return string
            }, '')
            .replace(/\?/, '\\?') +
          '$',
      )
      const routesToActiveNames: Array<string | null> = routesToActive.map((route) => route.name)
      const isBreak = !routesToActiveRegex.test(pathParts.join(''))

      if (isBreak) {
        routesToActiveNames.push(null)
      }

      await this.activate.bind(this)(routesToActiveNames, paramsToActive, optimistic)

      if (isBreak) {
        this.pathname = path
      }
    }

    return { ...composed, set }
  }
}

export { WithSet, WithSetOptions, WithSetInterface, SetActivator, isActivator }
