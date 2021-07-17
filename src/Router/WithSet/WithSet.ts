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

function getPathParts(path: string): string[] {
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
}

function WithSet<ComposedOptions extends RouterComposedOptions, ComposedInterface extends RouterComposedInterface>(
  createRouter?: (options: ComposedOptions) => ComposedInterface,
) {
  return function (options: WithSetOptions & ComposedOptions): WithSetInterface & ComposedInterface {
    const composed: ComposedInterface = createRouter?.(options) ?? ({} as ComposedInterface)

    async function set(this: WithSetInterface & ComposedInterface, path: string, optimistic?: boolean): Promise<void> {
      const pathParts = getPathParts(path)
      const map = this.getMap()
      const rootKey: RouteMapKey = map.entries().next().value[0]
      const rootRoute: RouteMapRoute | undefined = map.get(rootKey)
      const routesToActive: AbstractRoute[] = []
      const paramsToActive: Array<{ [key: string]: string }> = []
      let pathPartIndex = 0

      if (rootRoute?.route != null) {
        const recurse = (route: AbstractRoute): void => {
          if (pathPartIndex > pathParts.length - 1) {
            return
          }

          if (!Boolean(route?.match) && route.children != null) {
            routesToActive.push(route)
          }

          if (Boolean(route?.match)) {
            const part = pathParts[pathPartIndex]
            const matched = route.match(part)

            if (Boolean(matched)) {
              if (typeof matched !== 'boolean') {
                paramsToActive.push(matched)
              }

              routesToActive.push(route)

              if (route.children != null) {
                pathPartIndex = pathPartIndex + 1

                return (route.children as AbstractRoute[]).forEach(recurse)
              }
            }

            return
          }

          if (route.children != null) {
            return (route.children as AbstractRoute[]).forEach(recurse)
          }
        }

        recurse(rootRoute.route)
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
