import { Emitter } from 'nanoevents'

type Events = {
  popstate: (pathname: string, state?: unknown) => void
}

type HistoryInterface = {
  pathname: string | null
  push: (pathname: string | null, state?: unknown) => void
  replace: (pathname: string | null, state?: unknown) => void
  emitter: Emitter<Events>
}

export * from './BrowserHistory'
export { HistoryInterface }
