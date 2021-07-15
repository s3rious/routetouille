import { Emitter } from 'nanoevents'

type Events = {
  popstate: (pathname: string) => void
}

type HistoryInterface = {
  pathname: string | null
  push: (pathname: string | null) => void
  replace: (pathname: string | null) => void
  emitter: Emitter<Events>
}

export * from './BrowserHistory'
export { HistoryInterface }
