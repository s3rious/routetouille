import { WithGoTo } from './WithGoTo'
import { WithSet, WithSetInterface, WithSetOptions } from '../WithSet'
import { WithParams, WithParamsInterface, WithParamsOptions } from '../WithParams'
import { WithPathname, WithPathnameInterface, WithPathnameOptions } from '../WithPathname'
import { WithActive, WithActiveInterface, WithActiveOptions } from '../WithActive'
import { WithRoot, WithRootInterface, WithRootOptions } from '../WithRoot'
import { WithMap, WithMapInterface, WithMapOptions } from '../WithMap'

import { FallbackRoute, Route } from '../../Route'

type RouterComposedOptions = WithSetOptions &
  WithParamsOptions &
  WithPathnameOptions &
  WithActiveOptions &
  WithMapOptions &
  WithRootOptions
type RouterComposedInterface = WithSetInterface &
  WithParamsInterface &
  WithPathnameInterface &
  WithActiveInterface &
  WithMapInterface &
  WithRootInterface

describe('`WithGoTo` router', () => {
  const Router = WithGoTo<RouterComposedOptions, RouterComposedInterface>(
    WithSet(WithParams(WithPathname(WithActive(WithMap(WithRoot()))))),
  )

  describe('creation', () => {
    it('created with proper `active`', () => {
      const root = Route({ name: 'root', path: '/' })
      const router = Router({ root })

      expect(router.pathname).toEqual(null)
    })
  })

  describe('methods', () => {
    const router = Router({
      root: Route({
        name: 'root',
        path: '/',
        children: [
          FallbackRoute({
            name: '404',
          }),
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
    })

    it('`goTo`', async () => {
      await router.goTo(`/posts/1/`)
      expect(router.pathname).toEqual('/posts/1/')
      expect(router.params).toEqual([{ id: '1' }])
      expect(router.active.map((route) => route.name)).toEqual(['root', 'posts', 'post'])

      await router.goTo(`/posts/42/`, { optimistic: true })
      expect(router.pathname).toEqual('/posts/42/')
      expect(router.params).toEqual([{ id: '42' }])
      expect(router.active.map((route) => route.name)).toEqual(['root', 'posts', 'post'])

      await router.goTo(`/posts/1337/`, { optimistic: false })
      expect(router.pathname).toEqual('/posts/1337/')
      expect(router.params).toEqual([{ id: '1337' }])
      expect(router.active.map((route) => route.name)).toEqual(['root', 'posts', 'post'])

      await router.goTo(['posts'])
      expect(router.pathname).toEqual('/posts/')
      expect(router.params).toEqual([])
      expect(router.active.map((route) => route.name)).toEqual(['root', 'posts'])

      await router.goTo(['posts', 'post', 'comments', 'comment'], { params: [{ id: '1' }, { id: '2' }] })
      expect(router.pathname).toEqual('/posts/1/comments/2/')
      expect(router.params).toEqual([{ id: '1' }, { id: '2' }])
      expect(router.active.map((route) => route.name)).toEqual(['root', 'posts', 'post', 'comments', 'comment'])

      await router.goTo(['posts', 'post', 'comments', 'comment'], {
        params: [{ id: '2' }, { id: '34' }],
        optimistic: true,
      })
      expect(router.pathname).toEqual('/posts/2/comments/34/')
      expect(router.params).toEqual([{ id: '2' }, { id: '34' }])
      expect(router.active.map((route) => route.name)).toEqual(['root', 'posts', 'post', 'comments', 'comment'])

      await router.goTo(['posts', 'post', 'comments', 'comment'], {
        params: [{ id: '2' }, { id: '69' }],
        optimistic: false,
      })
      expect(router.pathname).toEqual('/posts/2/comments/69/')
      expect(router.params).toEqual([{ id: '2' }, { id: '69' }])
      expect(router.active.map((route) => route.name)).toEqual(['root', 'posts', 'post', 'comments', 'comment'])

      await router.goTo('root.posts')
      expect(router.pathname).toEqual('/posts/')
      expect(router.params).toEqual([])
      expect(router.active.map((route) => route.name)).toEqual(['root', 'posts'])

      await router.goTo('posts.post.comments.comment', { params: [{ id: '13' }, { id: '37' }] })
      expect(router.pathname).toEqual('/posts/13/comments/37/')
      expect(router.params).toEqual([{ id: '13' }, { id: '37' }])
      expect(router.active.map((route) => route.name)).toEqual(['root', 'posts', 'post', 'comments', 'comment'])
    })
  })
})
