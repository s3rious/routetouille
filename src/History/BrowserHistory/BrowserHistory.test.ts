/**
 * @jest-environment jsdom
 */

import { BrowserHistory } from './BrowserHistory'
import { HistoryInterface } from '../index'

describe('BrowserHistory', () => {
  it('creates with proper `pathname` when empty', () => {
    const history: HistoryInterface = BrowserHistory()

    expect(history.pathname).toEqual('/')
  })

  it('push', () => {
    jest.spyOn(window.history, 'pushState')

    const history: HistoryInterface = BrowserHistory()

    history.push('/foo/')
    expect(history.pathname).toEqual('/foo/')
    expect(window.location.pathname).toEqual('/foo/')
    expect(window.history.pushState).lastCalledWith('', '', '/foo/')

    history.push('/foo/?bar')
    expect(history.pathname).toEqual('/foo/?bar')
    expect(window.location.pathname).toEqual('/foo/')
    expect(window.location.search).toEqual('?bar')
    expect(window.history.pushState).lastCalledWith('', '', '/foo/?bar')

    history.push('/foo/?bar=baz')
    expect(history.pathname).toEqual('/foo/?bar=baz')
    expect(window.location.pathname).toEqual('/foo/')
    expect(window.location.search).toEqual('?bar=baz')
    expect(window.history.pushState).lastCalledWith('', '', '/foo/?bar=baz')

    history.push('/foo/?bar=baz#quz')
    expect(history.pathname).toEqual('/foo/?bar=baz#quz')
    expect(window.location.pathname).toEqual('/foo/')
    expect(window.location.search).toEqual('?bar=baz')
    expect(window.location.hash).toEqual('#quz')
    expect(window.history.pushState).lastCalledWith('', '', '/foo/?bar=baz#quz')

    expect(window.history.pushState).toBeCalledTimes(4)
    history.push(null)
    expect(window.history.pushState).toBeCalledTimes(4)
    expect(history.pathname).toEqual('/foo/?bar=baz#quz')
    expect(window.location.pathname).toEqual('/foo/')
    expect(window.location.search).toEqual('?bar=baz')
    expect(window.location.hash).toEqual('#quz')
    expect(window.history.pushState).lastCalledWith('', '', '/foo/?bar=baz#quz')
  })

  it('replace', () => {
    jest.spyOn(window.history, 'replaceState')

    const history: HistoryInterface = BrowserHistory()

    history.replace('/foo/')
    expect(history.pathname).toEqual('/foo/')
    expect(window.location.pathname).toEqual('/foo/')
    expect(window.history.replaceState).lastCalledWith('', '', '/foo/')

    history.replace('/foo/?bar')
    expect(history.pathname).toEqual('/foo/?bar')
    expect(window.location.pathname).toEqual('/foo/')
    expect(window.location.search).toEqual('?bar')
    expect(window.history.replaceState).lastCalledWith('', '', '/foo/?bar')

    history.replace('/foo/?bar=baz')
    expect(history.pathname).toEqual('/foo/?bar=baz')
    expect(window.location.pathname).toEqual('/foo/')
    expect(window.location.search).toEqual('?bar=baz')
    expect(window.history.replaceState).lastCalledWith('', '', '/foo/?bar=baz')

    history.replace('/foo/?bar=baz#quz')
    expect(history.pathname).toEqual('/foo/?bar=baz#quz')
    expect(window.location.pathname).toEqual('/foo/')
    expect(window.location.search).toEqual('?bar=baz')
    expect(window.location.hash).toEqual('#quz')
    expect(window.history.replaceState).lastCalledWith('', '', '/foo/?bar=baz#quz')

    expect(window.history.replaceState).toBeCalledTimes(4)
    history.replace(null)
    expect(window.history.replaceState).toBeCalledTimes(4)
    expect(history.pathname).toEqual('/foo/?bar=baz#quz')
    expect(window.location.pathname).toEqual('/foo/')
    expect(window.location.search).toEqual('?bar=baz')
    expect(window.location.hash).toEqual('#quz')
    expect(window.history.replaceState).lastCalledWith('', '', '/foo/?bar=baz#quz')
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
    expect(handlePopState).lastCalledWith('/foo/bar/?bar=foo#quz')

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
