import { createNanoEvents } from 'nanoevents'

import { WithHistory, WithHistoryInterface } from './WithHistory'
import { WithGoTo, WithGoToInterface, WithGoToOptions } from '../WithGoTo'
import { WithSet, WithSetInterface, WithSetOptions } from '../WithSet'
import { WithParams, WithParamsInterface, WithParamsOptions } from '../WithParams'
import { WithPathname, WithPathnameInterface, WithPathnameOptions } from '../WithPathname'
import { WithActive, WithActiveInterface, WithActiveOptions } from '../WithActive'
import { WithRoot, WithRootInterface, WithRootOptions } from '../WithRoot'
import { WithMap, WithMapInterface, WithMapOptions } from '../WithMap'

import { FallbackRoute, ModuleRoute, Route, RouteInterface } from '../../Route'

import { HistoryInterface } from '../../History'

type RouterComposedOptions = WithGoToOptions &
  WithSetOptions &
  WithParamsOptions &
  WithPathnameOptions &
  WithActiveOptions &
  WithMapOptions &
  WithRootOptions
type RouterComposedInterface = WithGoToInterface &
  WithSetInterface &
  WithParamsInterface &
  WithPathnameInterface &
  WithActiveInterface &
  WithMapInterface &
  WithRootInterface

const createMockHistory = (pathname: string | null): HistoryInterface => ({
  pathname,
  push: jest.fn(),
  replace: jest.fn(),
  emitter: createNanoEvents(),
})

const waitFor = async (time: number = 0): Promise<unknown> =>
  await new Promise((resolve) => setTimeout(() => resolve(null), time))

describe('`WithHistory` router', () => {
  const Router = WithHistory<RouterComposedOptions, RouterComposedInterface>(
    WithGoTo(WithSet(WithParams(WithPathname(WithActive(WithMap(WithRoot())))))),
  )

  const createRouter = (
    history: HistoryInterface,
    additionalRoutes: RouteInterface[] = [],
  ): WithHistoryInterface & RouterComposedInterface => {
    return Router({
      history,
      root: ModuleRoute({
        name: 'root',
        children: [
          Route({
            name: 'main',
            path: '/',
            children: [
              ...additionalRoutes,
              Route({
                name: 'posts',
                path: 'posts/',
                children: [
                  Route({
                    name: 'post',
                    path: ':id/',
                    children: [
                      FallbackRoute({
                        name: 'post-404',
                      }),
                      Route({
                        name: 'comments',
                        path: 'comments/',
                        children: [
                          Route({
                            name: 'comment',
                            path: ':id/',
                            children: [
                              Route({
                                name: 'mode',
                                path: '?mode=:mode',
                                children: [
                                  Route({
                                    name: 'hash',
                                    path: '#hash',
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          FallbackRoute({
            name: '404',
          }),
        ],
      }),
    })
  }

  describe('creation', () => {
    it('created with null `active``', async () => {
      const history = createMockHistory(null)
      const router = createRouter(history)
      await router.init()

      expect(router.pathname).toEqual(null)
      expect(router.params).toEqual([])
      expect(router.active.map((route) => route.name)).toEqual([])
      expect(history.push).toBeCalledTimes(0)
      expect(history.replace).toBeCalledTimes(0)
    })

    it('created with `active` from `history.pathname`', async () => {
      const history = createMockHistory('/')
      const router = createRouter(history)
      await router.init()

      expect(router.pathname).toEqual('/')
      expect(router.params).toEqual([])
      expect(router.active.map((route) => route.name)).toEqual(['root', 'main'])
      expect(history.push).toBeCalledTimes(0)
      expect(history.replace).toBeCalledTimes(1)
      expect(history.replace).lastCalledWith('/', { scrollTop: 0 })
    })

    it('created with `active` from another `history.pathname`', async () => {
      const history = createMockHistory('/posts/2/comments/69/')
      const router = createRouter(history)
      await router.init()

      expect(router.pathname).toEqual('/posts/2/comments/69/')
      expect(router.params).toEqual([{ id: '2' }, { id: '69' }])
      expect(router.active.map((route) => route.name)).toEqual(['root', 'main', 'posts', 'post', 'comments', 'comment'])
      expect(history.push).toBeCalledTimes(0)
      expect(history.replace).toBeCalledTimes(1)
      expect(history.replace).lastCalledWith('/posts/2/comments/69/', { scrollTop: 0 })
    })
  })

  describe('methods', () => {
    let shouldRedirect: boolean = false
    let history: HistoryInterface
    let router: WithHistoryInterface & RouterComposedInterface

    beforeEach(async () => {
      history = createMockHistory('/')
      router = createRouter(history, [
        Route({
          name: 'admin',
          path: 'admin/',
          redirects: [[async () => shouldRedirect, async () => await router.activate(['root', 'main'], [], false)]],
        }),
      ])
      await router.init()
    })

    it('`goTo`', async () => {
      expect(history.push).toBeCalledTimes(0)
      expect(history.replace).toBeCalledTimes(1)
      expect(history.replace).lastCalledWith('/', { scrollTop: 0 })

      await router.goTo('posts.post.comments.comment', { params: [{ id: '13' }, { id: '37' }] })
      expect(router.pathname).toEqual('/posts/13/comments/37/')
      expect(router.params).toEqual([{ id: '13' }, { id: '37' }])
      expect(router.active.map((route) => route.name)).toEqual(['root', 'main', 'posts', 'post', 'comments', 'comment'])
      expect(history.push).toBeCalledTimes(1)
      expect(history.push).lastCalledWith('/posts/13/comments/37/', { scrollTop: 0 })
      expect(history.replace).toBeCalledTimes(1)

      await router.goTo('root.main.posts', { state: { scrollTop: 666 } })
      expect(router.pathname).toEqual('/posts/')
      expect(router.params).toEqual([])
      expect(router.active.map((route) => route.name)).toEqual(['root', 'main', 'posts'])
      expect(history.push).toBeCalledTimes(2)
      expect(history.push).lastCalledWith('/posts/', { scrollTop: 666 })
      expect(history.replace).toBeCalledTimes(1)

      await router.goTo(['posts', 'post', 'comments', 'comment'], {
        params: [{ id: '2' }, { id: '69' }],
        optimistic: false,
      })
      expect(router.pathname).toEqual('/posts/2/comments/69/')
      expect(router.params).toEqual([{ id: '2' }, { id: '69' }])
      expect(router.active.map((route) => route.name)).toEqual(['root', 'main', 'posts', 'post', 'comments', 'comment'])
      expect(history.push).toBeCalledTimes(3)
      expect(history.push).lastCalledWith('/posts/2/comments/69/', { scrollTop: 0 })
      expect(history.replace).toBeCalledTimes(1)

      await router.goTo('/', { method: 'replace' })
      expect(router.params).toEqual([])
      expect(router.active.map((route) => route.name)).toEqual(['root', 'main'])
      expect(history.push).toBeCalledTimes(3)
      expect(history.replace).toBeCalledTimes(2)
      expect(history.replace).lastCalledWith('/', { scrollTop: 0 })

      await router.goTo('posts.post.comments.comment', {
        method: 'replace',
        params: [{ id: '13' }, { id: '37' }],
        state: { scrollTop: 345 },
      })
      expect(router.pathname).toEqual('/posts/13/comments/37/')
      expect(router.params).toEqual([{ id: '13' }, { id: '37' }])
      expect(router.active.map((route) => route.name)).toEqual(['root', 'main', 'posts', 'post', 'comments', 'comment'])
      expect(history.push).toBeCalledTimes(3)
      expect(history.replace).toBeCalledTimes(3)
      expect(history.replace).lastCalledWith('/posts/13/comments/37/', { scrollTop: 345 })

      await router.goTo('/foo/')
      expect(router.pathname).toEqual('/foo/')
      expect(router.params).toEqual([])
      expect(router.active.map((route) => route.name)).toEqual(['root', '404'])
      expect(history.push).toBeCalledTimes(4)
      expect(history.push).lastCalledWith('/foo/', { scrollTop: 0 })
      expect(history.replace).toBeCalledTimes(3)
    })

    it('handles redirect', async () => {
      expect(history.push).toBeCalledTimes(0)
      expect(history.replace).toBeCalledTimes(1)
      expect(history.replace).lastCalledWith('/', { scrollTop: 0 })

      await router.goTo('/admin/')
      expect(router.pathname).toEqual('/admin/')
      expect(router.params).toEqual([])
      expect(router.active.map((route) => route.name)).toEqual(['root', 'main', 'admin'])
      expect(history.push).toBeCalledTimes(1)
      expect(history.replace).toBeCalledTimes(1)

      await router.goTo('/posts/')
      expect(router.pathname).toEqual('/posts/')
      expect(router.params).toEqual([])
      expect(router.active.map((route) => route.name)).toEqual(['root', 'main', 'posts'])
      expect(history.push).toBeCalledTimes(2)
      expect(history.push).lastCalledWith('/posts/', { scrollTop: 0 })
      expect(history.replace).toBeCalledTimes(1)

      shouldRedirect = true
      await router.goTo('/admin/')
      expect(router.pathname).toEqual('/')
      expect(router.params).toEqual([])
      expect(router.active.map((route) => route.name)).toEqual(['root', 'main'])
      expect(router.pathname).toEqual('/')
      expect(history.push).toBeCalledTimes(3)
      expect(history.push).lastCalledWith('/', { scrollTop: 0 })
      expect(history.replace).toBeCalledTimes(2)
      expect(history.replace).lastCalledWith('/', { scrollTop: 0 })

      await router.goTo('/', { optimistic: true })
      expect(router.pathname).toEqual('/')
      expect(router.params).toEqual([])
      expect(router.active.map((route) => route.name)).toEqual(['root', 'main'])
      expect(history.push).toBeCalledTimes(4)
      expect(history.push).lastCalledWith('/', { scrollTop: 0 })
      expect(history.replace).toBeCalledTimes(2)
      await waitFor(0)
      expect(router.pathname).toEqual('/')
      expect(router.params).toEqual([])
      expect(router.active.map((route) => route.name)).toEqual(['root', 'main'])
      expect(history.replace).toBeCalledTimes(2)

      await router.goTo('/admin/', { optimistic: true })
      expect(router.pathname).toEqual('/admin/')
      expect(router.params).toEqual([])
      expect(router.active.map((route) => route.name)).toEqual(['root', 'main', 'admin'])
      expect(history.push).toBeCalledTimes(5)
      expect(history.push).lastCalledWith('/admin/', { scrollTop: 0 })
      await waitFor(0)
      expect(router.pathname).toEqual('/')
      expect(router.params).toEqual([])
      expect(router.active.map((route) => route.name)).toEqual(['root', 'main'])
      expect(history.push).toBeCalledTimes(5)
      expect(history.push).lastCalledWith('/admin/', { scrollTop: 0 })
      expect(history.replace).toBeCalledTimes(3)
      expect(history.replace).lastCalledWith('/', { scrollTop: 0 })

      await router.goTo('/admin/', { optimistic: true })
      expect(router.pathname).toEqual('/admin/')
      expect(router.params).toEqual([])
      expect(router.active.map((route) => route.name)).toEqual(['root', 'main', 'admin'])
      expect(history.push).toBeCalledTimes(6)
      expect(history.push).lastCalledWith('/admin/', { scrollTop: 0 })
      await waitFor(0)
      expect(router.pathname).toEqual('/')
      expect(router.params).toEqual([])
      expect(router.active.map((route) => route.name)).toEqual(['root', 'main'])
      expect(history.push).toBeCalledTimes(6)
      expect(history.push).lastCalledWith('/admin/', { scrollTop: 0 })
      expect(history.replace).toBeCalledTimes(4)
      expect(history.replace).lastCalledWith('/', { scrollTop: 0 })

      await router.goTo(['posts', 'post', 'comments', 'comment'], {
        params: [{ id: '2' }, { id: '69' }],
        optimistic: true,
      })
      expect(router.pathname).toEqual('/posts/2/comments/69/')
      expect(router.params).toEqual([{ id: '2' }, { id: '69' }])
      expect(router.active.map((route) => route.name)).toEqual(['root', 'main', 'posts', 'post', 'comments', 'comment'])
      expect(history.push).toBeCalledTimes(7)
      expect(history.push).lastCalledWith('/posts/2/comments/69/', { scrollTop: 0 })
      expect(history.replace).toBeCalledTimes(4)
      expect(history.replace).lastCalledWith('/', { scrollTop: 0 })
      await waitFor(0)
      expect(router.pathname).toEqual('/posts/2/comments/69/')
      expect(router.params).toEqual([{ id: '2' }, { id: '69' }])
      expect(router.active.map((route) => route.name)).toEqual(['root', 'main', 'posts', 'post', 'comments', 'comment'])
      expect(history.push).toBeCalledTimes(7)
      expect(history.push).lastCalledWith('/posts/2/comments/69/', { scrollTop: 0 })
      expect(history.replace).toBeCalledTimes(4)
      expect(history.replace).lastCalledWith('/', { scrollTop: 0 })

      await router.goTo('/admin/', { optimistic: true })
      expect(router.pathname).toEqual('/admin/')
      expect(router.params).toEqual([])
      expect(router.active.map((route) => route.name)).toEqual(['root', 'main', 'admin'])
      expect(history.push).toBeCalledTimes(8)
      expect(history.push).lastCalledWith('/admin/', { scrollTop: 0 })
      await waitFor(0)
      expect(router.pathname).toEqual('/')
      expect(router.params).toEqual([])
      expect(router.active.map((route) => route.name)).toEqual(['root', 'main'])
      expect(history.push).toBeCalledTimes(8)
      expect(history.push).lastCalledWith('/admin/', { scrollTop: 0 })
      expect(history.replace).toBeCalledTimes(5)
      expect(history.replace).lastCalledWith('/', { scrollTop: 0 })
    })

    it('triggers `goTo` on emitter', async () => {
      expect(history.push).toBeCalledTimes(0)
      expect(history.replace).toBeCalledTimes(1)
      expect(history.replace).lastCalledWith('/', { scrollTop: 0 })

      history.emitter.emit('popstate', '/posts/13/comments/37/')
      expect(history.push).toBeCalledTimes(0)
      expect(history.replace).toBeCalledTimes(1)
      await waitFor(0)
      expect(router.pathname).toEqual('/posts/13/comments/37/')
      expect(router.params).toEqual([{ id: '13' }, { id: '37' }])
      expect(router.active.map((route) => route.name)).toEqual(['root', 'main', 'posts', 'post', 'comments', 'comment'])
      expect(history.push).toBeCalledTimes(0)
      expect(history.replace).toBeCalledTimes(1)

      history.emitter.emit('popstate', '/posts/13/comments/69/')
      expect(history.push).toBeCalledTimes(0)
      expect(history.replace).toBeCalledTimes(1)
      await waitFor(0)
      expect(router.pathname).toEqual('/posts/13/comments/69/')
      expect(router.params).toEqual([{ id: '13' }, { id: '69' }])
      expect(router.active.map((route) => route.name)).toEqual(['root', 'main', 'posts', 'post', 'comments', 'comment'])
      expect(history.push).toBeCalledTimes(0)
      expect(history.replace).toBeCalledTimes(1)
    })
  })
})
