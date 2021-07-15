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

  function push(this: HistoryInterface, pathname: string | null): void {
    if (pathname != null) {
      window.history.pushState('', '', pathname)
      this.pathname = pathname
    }
  }

  function replace(this: HistoryInterface, pathname: string | null): void {
    if (pathname != null) {
      window.history.replaceState('', '', pathname)
      this.pathname = pathname
    }
  }

  function onPopState(this: HistoryInterface): void {
    const pathname: string = getPathName()
    emitter.emit('popstate', pathname)
  }

  globalThis.addEventListener('popstate', onPopState)

  return { pathname, push, replace, emitter }
}

export { BrowserHistory }
