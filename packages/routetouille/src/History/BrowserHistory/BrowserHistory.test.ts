/**
 * @jest-environment jsdom
 */

import { HistoryInterface } from '../index'
import { BrowserHistory } from './BrowserHistory'

describe('BrowserHistory', () => {
  it('creates with proper `pathname` when empty', () => {
    const history: HistoryInterface = BrowserHistory()

    expect(history.pathname).toEqual('/')
  })

  it('push', () => {
    jest.spyOn(globalThis.history, 'pushState')

    const history: HistoryInterface = BrowserHistory()

    history.push('/foo/')
    expect(history.pathname).toEqual('/foo/')
    expect(globalThis.location.pathname).toEqual('/foo/')
    expect(globalThis.history.pushState).lastCalledWith(null, '', '/foo/')

    history.push('/foo/?bar', { scrollTop: 100 })
    expect(history.pathname).toEqual('/foo/?bar')
    expect(globalThis.location.pathname).toEqual('/foo/')
    expect(globalThis.location.search).toEqual('?bar')
    expect(globalThis.history.pushState).lastCalledWith({ scrollTop: 100 }, '', '/foo/?bar')

    history.push('/foo/?bar=baz')
    expect(history.pathname).toEqual('/foo/?bar=baz')
    expect(globalThis.location.pathname).toEqual('/foo/')
    expect(globalThis.location.search).toEqual('?bar=baz')
    expect(globalThis.history.pushState).lastCalledWith(null, '', '/foo/?bar=baz')

    history.push('/foo/?bar=baz#quz', { scrollTop: 200 })
    expect(history.pathname).toEqual('/foo/?bar=baz#quz')
    expect(globalThis.location.pathname).toEqual('/foo/')
    expect(globalThis.location.search).toEqual('?bar=baz')
    expect(globalThis.location.hash).toEqual('#quz')
    expect(globalThis.history.pushState).lastCalledWith({ scrollTop: 200 }, '', '/foo/?bar=baz#quz')

    expect(globalThis.history.pushState).toBeCalledTimes(4)
    history.push(null)
    expect(globalThis.history.pushState).toBeCalledTimes(4)
    expect(history.pathname).toEqual('/foo/?bar=baz#quz')
    expect(globalThis.location.pathname).toEqual('/foo/')
    expect(globalThis.location.search).toEqual('?bar=baz')
    expect(globalThis.location.hash).toEqual('#quz')
    expect(globalThis.history.pushState).lastCalledWith({ scrollTop: 200 }, '', '/foo/?bar=baz#quz')
  })

  it('replace', () => {
    jest.spyOn(globalThis.history, 'replaceState')

    const history: HistoryInterface = BrowserHistory()

    history.replace('/foo/')
    expect(history.pathname).toEqual('/foo/')
    expect(globalThis.location.pathname).toEqual('/foo/')
    expect(globalThis.history.replaceState).lastCalledWith(null, '', '/foo/')

    history.replace('/foo/?bar', { scrollTop: 100 })
    expect(history.pathname).toEqual('/foo/?bar')
    expect(globalThis.location.pathname).toEqual('/foo/')
    expect(globalThis.location.search).toEqual('?bar')
    expect(globalThis.history.replaceState).lastCalledWith({ scrollTop: 100 }, '', '/foo/?bar')

    history.replace('/foo/?bar=baz')
    expect(history.pathname).toEqual('/foo/?bar=baz')
    expect(globalThis.location.pathname).toEqual('/foo/')
    expect(globalThis.location.search).toEqual('?bar=baz')
    expect(globalThis.history.replaceState).lastCalledWith(null, '', '/foo/?bar=baz')

    history.replace('/foo/?bar=baz#quz', { scrollTop: 200 })
    expect(history.pathname).toEqual('/foo/?bar=baz#quz')
    expect(globalThis.location.pathname).toEqual('/foo/')
    expect(globalThis.location.search).toEqual('?bar=baz')
    expect(globalThis.location.hash).toEqual('#quz')
    expect(globalThis.history.replaceState).lastCalledWith({ scrollTop: 200 }, '', '/foo/?bar=baz#quz')

    expect(globalThis.history.replaceState).toBeCalledTimes(4)
    history.replace(null)
    expect(globalThis.history.replaceState).toBeCalledTimes(4)
    expect(history.pathname).toEqual('/foo/?bar=baz#quz')
    expect(globalThis.location.pathname).toEqual('/foo/')
    expect(globalThis.location.search).toEqual('?bar=baz')
    expect(globalThis.location.hash).toEqual('#quz')
    expect(globalThis.history.replaceState).lastCalledWith({ scrollTop: 200 }, '', '/foo/?bar=baz#quz')
  })

  it('emitter', () => {
    const originalWindow = window
    // eslint-disable-next-line no-global-assign
    window = Object.create(window)
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://example.com',
        pathname: '/foo/bar/',
        search: '?bar=foo',
        hash: '#quz',
      },
    })

    const handlePopState = jest.fn()
    const history: HistoryInterface = BrowserHistory()
    history.emitter.on('popstate', handlePopState)

    globalThis.dispatchEvent(new Event('popstate'))
    expect(handlePopState).toBeCalledTimes(1)
    expect(handlePopState).lastCalledWith('/foo/bar/?bar=foo#quz', undefined)

    // eslint-disable-next-line no-global-assign
    window = originalWindow
  })

  describe('creation', () => {
    it('creates with proper `pathname` when non empty', () => {
      const originalWindow = window

      // eslint-disable-next-line no-global-assign
      window = Object.create(window)
      Object.defineProperty(window, 'location', {
        value: {
          href: 'http://example.com',
          pathname: '/foo/bar/',
          search: '?bar=foo',
          hash: '#quz',
        },
      })

      const history: HistoryInterface = BrowserHistory()
      expect(history.pathname).toEqual('/foo/bar/?bar=foo#quz')

      // eslint-disable-next-line no-global-assign
      window = originalWindow
    })
  })
})
