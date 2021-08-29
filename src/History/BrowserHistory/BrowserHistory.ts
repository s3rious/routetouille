import { createNanoEvents } from 'nanoevents'
import { HistoryInterface } from '../index'

function getPathName(): string {
  const locationPathname: string = globalThis.location.pathname
  const locationSearch: string = globalThis.location.search
  const locationHash: string = globalThis.location.hash
  return locationPathname + locationSearch + locationHash
}

function BrowserHistory(): HistoryInterface {
  const pathname: string = getPathName()
  const emitter = createNanoEvents()

  function push(this: HistoryInterface, pathname: string | null, state?: unknown): void {
    if (pathname != null) {
      globalThis.history.pushState(state ?? null, '', pathname)
      this.pathname = pathname
    }
  }

  function replace(this: HistoryInterface, pathname: string | null, state?: unknown): void {
    if (pathname != null) {
      globalThis.history.replaceState(state ?? null, '', pathname)
      this.pathname = pathname
    }
  }

  function onPopState(this: Window, event: PopStateEvent): void {
    const pathname: string = getPathName()
    emitter.emit('popstate', pathname, event?.state)
  }

  globalThis.addEventListener('popstate', onPopState)

  return { pathname, push, replace, emitter }
}

export { BrowserHistory }
