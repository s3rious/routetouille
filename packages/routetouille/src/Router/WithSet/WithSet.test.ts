import { WithSet } from './WithSet'
import { WithParams, WithParamsInterface, WithParamsOptions } from '../WithParams'
import { WithPathname, WithPathnameInterface, WithPathnameOptions } from '../WithPathname'
import { WithActive, WithActiveInterface, WithActiveOptions } from '../WithActive'
import { WithRoot, WithRootInterface, WithRootOptions } from '../WithRoot'
import { WithMap, WithMapInterface, WithMapOptions } from '../WithMap'

import { FallbackRoute, FallbackRouteInterface, ModuleRoute, Route, RouteInterface } from '../../Route'

type RouterComposedOptions = WithParamsOptions &
  WithPathnameOptions &
  WithActiveOptions &
  WithMapOptions &
  WithRootOptions
type RouterComposedInterface = WithParamsInterface &
  WithPathnameInterface &
  WithActiveInterface &
  WithMapInterface &
  WithRootInterface

describe('`WithSet` router', () => {
  const Router = WithSet<RouterComposedOptions, RouterComposedInterface>(
    WithParams(WithPathname(WithActive(WithMap(WithRoot())))),
  )

  describe('creation', () => {
    it('created with proper `active`', () => {
      const root = Route({ name: 'root', path: '/' })
      const router = Router({ root })

      expect(router.pathname).toEqual(null)
    })
  })

  describe('methods', () => {
    const getPostsRoute = (additionalRoutes: Array<RouteInterface | FallbackRouteInterface> = []): RouteInterface =>
      Route({
        name: 'posts',
        path: 'posts/',
        children: [
          Route({
            name: 'post',
            path: ':id/',
            children: [
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
          ...additionalRoutes,
        ],
      })

    describe('`set`', () => {
      it('with `Route` root, without fallback', async () => {
        const router = Router({
          root: Route({
            name: 'root',
            path: '/',
            children: [getPostsRoute()],
          }),
        })

        await router.set('/foo/')
        expect(router.pathname).toEqual('/foo/')
        expect(router.params).toEqual([])
        expect(router.active.map((route) => route.name)).toEqual([])

        await router.set('/foo/bar/')
        expect(router.pathname).toEqual('/foo/bar/')
        expect(router.params).toEqual([])
        expect(router.active.map((route) => route.name)).toEqual([])

        await router.set('/posts/1/foo/bar/')
        expect(router.pathname).toEqual('/posts/1/foo/bar/')
        expect(router.params).toEqual([{ id: '1' }])
        expect(router.active.map((route) => route.name)).toEqual([])

        await router.set('/')
        expect(router.pathname).toEqual('/')
        expect(router.params).toEqual([])
        expect(router.active.map((route) => route.name)).toEqual(['root'])

        await router.set('/posts/')
        expect(router.pathname).toEqual('/posts/')
        expect(router.params).toEqual([])
        expect(router.active.map((route) => route.name)).toEqual(['root', 'posts'])

        await router.set('/posts/1/')
        expect(router.pathname).toEqual('/posts/1/')
        expect(router.params).toEqual([{ id: '1' }])
        expect(router.active.map((route) => route.name)).toEqual(['root', 'posts', 'post'])

        await router.set('/posts/1/comments/2/')
        expect(router.pathname).toEqual('/posts/1/comments/2/')
        expect(router.params).toEqual([{ id: '1' }, { id: '2' }])
        expect(router.active.map((route) => route.name)).toEqual(['root', 'posts', 'post', 'comments', 'comment'])

        await router.set('/posts/1/comments/2/?mode=edit')
        expect(router.pathname).toEqual('/posts/1/comments/2/?mode=edit')
        expect(router.params).toEqual([{ id: '1' }, { id: '2' }, { mode: 'edit' }])
        expect(router.active.map((route) => route.name)).toEqual([
          'root',
          'posts',
          'post',
          'comments',
          'comment',
          'mode',
        ])

        await router.set('/posts/1/comments/2/?mode=edit#hash')
        expect(router.pathname).toEqual('/posts/1/comments/2/?mode=edit#hash')
        expect(router.params).toEqual([{ id: '1' }, { id: '2' }, { mode: 'edit' }])
        expect(router.active.map((route) => route.name)).toEqual([
          'root',
          'posts',
          'post',
          'comments',
          'comment',
          'mode',
          'hash',
        ])
      })

      it('with `Route` root, with fallback', async () => {
        const router = Router({
          root: Route({
            name: 'root',
            path: '/',
            children: [
              getPostsRoute([
                FallbackRoute({
                  name: 'posts-404',
                }),
              ]),
              FallbackRoute({
                name: '404',
              }),
            ],
          }),
        })

        await router.set('/foo/')
        expect(router.pathname).toEqual('/foo/')
        expect(router.params).toEqual([])
        expect(router.active.map((route) => route.name)).toEqual(['root', '404'])

        await router.set('/foo/bar/')
        expect(router.pathname).toEqual('/foo/bar/')
        expect(router.params).toEqual([])
        expect(router.active.map((route) => route.name)).toEqual(['root', '404'])

        await router.set('/posts/1/foo/bar/')
        expect(router.pathname).toEqual('/posts/1/foo/bar/')
        expect(router.params).toEqual([{ id: '1' }])
        expect(router.active.map((route) => route.name)).toEqual(['root', 'posts', 'posts-404'])

        await router.set('/')
        expect(router.pathname).toEqual('/')
        expect(router.params).toEqual([])
        expect(router.active.map((route) => route.name)).toEqual(['root'])

        await router.set('/posts/')
        expect(router.pathname).toEqual('/posts/')
        expect(router.params).toEqual([])
        expect(router.active.map((route) => route.name)).toEqual(['root', 'posts'])

        await router.set('/posts/1/')
        expect(router.pathname).toEqual('/posts/1/')
        expect(router.params).toEqual([{ id: '1' }])
        expect(router.active.map((route) => route.name)).toEqual(['root', 'posts', 'post'])

        await router.set('/posts/1/comments/2/')
        expect(router.pathname).toEqual('/posts/1/comments/2/')
        expect(router.params).toEqual([{ id: '1' }, { id: '2' }])
        expect(router.active.map((route) => route.name)).toEqual(['root', 'posts', 'post', 'comments', 'comment'])

        await router.set('/posts/1/comments/2/?mode=edit')
        expect(router.pathname).toEqual('/posts/1/comments/2/?mode=edit')
        expect(router.params).toEqual([{ id: '1' }, { id: '2' }, { mode: 'edit' }])
        expect(router.active.map((route) => route.name)).toEqual([
          'root',
          'posts',
          'post',
          'comments',
          'comment',
          'mode',
        ])

        await router.set('/posts/1/comments/2/?mode=edit#hash')
        expect(router.pathname).toEqual('/posts/1/comments/2/?mode=edit#hash')
        expect(router.params).toEqual([{ id: '1' }, { id: '2' }, { mode: 'edit' }])
        expect(router.active.map((route) => route.name)).toEqual([
          'root',
          'posts',
          'post',
          'comments',
          'comment',
          'mode',
          'hash',
        ])
      })

      it('with `ModuleRoute` root, without fallback', async () => {
        const router = Router({
          root: ModuleRoute({
            name: 'root',
            children: [
              Route({
                name: 'main',
                path: '/',
                children: [getPostsRoute()],
              }),
            ],
          }),
        })

        await router.set('/foo/')
        expect(router.pathname).toEqual('/foo/')
        expect(router.params).toEqual([])
        expect(router.active.map((route) => route.name)).toEqual([])

        await router.set('/foo/bar/')
        expect(router.pathname).toEqual('/foo/bar/')
        expect(router.params).toEqual([])
        expect(router.active.map((route) => route.name)).toEqual([])

        await router.set('/posts/1/foo/bar/')
        expect(router.pathname).toEqual('/posts/1/foo/bar/')
        expect(router.params).toEqual([{ id: '1' }])
        expect(router.active.map((route) => route.name)).toEqual([])

        await router.set('/')
        expect(router.pathname).toEqual('/')
        expect(router.params).toEqual([])
        expect(router.active.map((route) => route.name)).toEqual(['root', 'main'])

        await router.set('/posts/')
        expect(router.pathname).toEqual('/posts/')
        expect(router.params).toEqual([])
        expect(router.active.map((route) => route.name)).toEqual(['root', 'main', 'posts'])

        await router.set('/posts/1/')
        expect(router.pathname).toEqual('/posts/1/')
        expect(router.params).toEqual([{ id: '1' }])
        expect(router.active.map((route) => route.name)).toEqual(['root', 'main', 'posts', 'post'])

        await router.set('/posts/1/comments/2/')
        expect(router.pathname).toEqual('/posts/1/comments/2/')
        expect(router.params).toEqual([{ id: '1' }, { id: '2' }])
        expect(router.active.map((route) => route.name)).toEqual([
          'root',
          'main',
          'posts',
          'post',
          'comments',
          'comment',
        ])

        await router.set('/posts/1/comments/2/?mode=edit')
        expect(router.pathname).toEqual('/posts/1/comments/2/?mode=edit')
        expect(router.params).toEqual([{ id: '1' }, { id: '2' }, { mode: 'edit' }])
        expect(router.active.map((route) => route.name)).toEqual([
          'root',
          'main',
          'posts',
          'post',
          'comments',
          'comment',
          'mode',
        ])

        await router.set('/posts/1/comments/2/?mode=edit#hash')
        expect(router.pathname).toEqual('/posts/1/comments/2/?mode=edit#hash')
        expect(router.params).toEqual([{ id: '1' }, { id: '2' }, { mode: 'edit' }])
        expect(router.active.map((route) => route.name)).toEqual([
          'root',
          'main',
          'posts',
          'post',
          'comments',
          'comment',
          'mode',
          'hash',
        ])
      })

      it('with `ModuleRoute` root, with fallback', async () => {
        const router = Router({
          root: ModuleRoute({
            name: 'root',
            children: [
              Route({
                name: 'main',
                path: '/',
                children: [
                  getPostsRoute([
                    FallbackRoute({
                      name: 'posts-404',
                    }),
                  ]),
                  FallbackRoute({
                    name: '404',
                  }),
                ],
              }),
            ],
          }),
        })

        await router.set('/foo/')
        expect(router.pathname).toEqual('/foo/')
        expect(router.params).toEqual([])
        expect(router.active.map((route) => route.name)).toEqual(['root', 'main', '404'])

        await router.set('/foo/bar/')
        expect(router.pathname).toEqual('/foo/bar/')
        expect(router.params).toEqual([])
        expect(router.active.map((route) => route.name)).toEqual(['root', 'main', '404'])

        await router.set('/posts/1/foo/bar/')
        expect(router.pathname).toEqual('/posts/1/foo/bar/')
        expect(router.params).toEqual([{ id: '1' }])
        expect(router.active.map((route) => route.name)).toEqual(['root', 'main', 'posts', 'posts-404'])

        await router.set('/')
        expect(router.pathname).toEqual('/')
        expect(router.params).toEqual([])
        expect(router.active.map((route) => route.name)).toEqual(['root', 'main'])

        await router.set('/posts/')
        expect(router.pathname).toEqual('/posts/')
        expect(router.params).toEqual([])
        expect(router.active.map((route) => route.name)).toEqual(['root', 'main', 'posts'])

        await router.set('/posts/1/')
        expect(router.pathname).toEqual('/posts/1/')
        expect(router.params).toEqual([{ id: '1' }])
        expect(router.active.map((route) => route.name)).toEqual(['root', 'main', 'posts', 'post'])

        await router.set('/posts/1/comments/2/')
        expect(router.pathname).toEqual('/posts/1/comments/2/')
        expect(router.params).toEqual([{ id: '1' }, { id: '2' }])
        expect(router.active.map((route) => route.name)).toEqual([
          'root',
          'main',
          'posts',
          'post',
          'comments',
          'comment',
        ])

        await router.set('/posts/1/comments/2/?mode=edit')
        expect(router.pathname).toEqual('/posts/1/comments/2/?mode=edit')
        expect(router.params).toEqual([{ id: '1' }, { id: '2' }, { mode: 'edit' }])
        expect(router.active.map((route) => route.name)).toEqual([
          'root',
          'main',
          'posts',
          'post',
          'comments',
          'comment',
          'mode',
        ])

        await router.set('/posts/1/comments/2/?mode=edit#hash')
        expect(router.pathname).toEqual('/posts/1/comments/2/?mode=edit#hash')
        expect(router.params).toEqual([{ id: '1' }, { id: '2' }, { mode: 'edit' }])
        expect(router.active.map((route) => route.name)).toEqual([
          'root',
          'main',
          'posts',
          'post',
          'comments',
          'comment',
          'mode',
          'hash',
        ])
      })

      it('without `/` route, without fallback', async () => {
        const router = Router({
          root: ModuleRoute({
            name: 'root',
            children: [getPostsRoute()],
          }),
        })

        await router.set('/foo/')
        expect(router.pathname).toEqual('/foo/')
        expect(router.params).toEqual([])
        expect(router.active.map((route) => route.name)).toEqual([])

        await router.set('/foo/bar/')
        expect(router.pathname).toEqual('/foo/bar/')
        expect(router.params).toEqual([])
        expect(router.active.map((route) => route.name)).toEqual([])

        await router.set('/posts/1/foo/bar/')
        expect(router.pathname).toEqual('/posts/1/foo/bar/')
        expect(router.params).toEqual([{ id: '1' }])
        expect(router.active.map((route) => route.name)).toEqual([])

        await router.set('/')
        expect(router.pathname).toEqual('/')
        expect(router.params).toEqual([])
        expect(router.active.map((route) => route.name)).toEqual([])

        await router.set('/posts/')
        expect(router.pathname).toEqual('/posts/')
        expect(router.params).toEqual([])
        expect(router.active.map((route) => route.name)).toEqual(['root', 'posts'])

        await router.set('/posts/1/')
        expect(router.pathname).toEqual('/posts/1/')
        expect(router.params).toEqual([{ id: '1' }])
        expect(router.active.map((route) => route.name)).toEqual(['root', 'posts', 'post'])

        await router.set('/posts/1/comments/2/')
        expect(router.pathname).toEqual('/posts/1/comments/2/')
        expect(router.params).toEqual([{ id: '1' }, { id: '2' }])
        expect(router.active.map((route) => route.name)).toEqual(['root', 'posts', 'post', 'comments', 'comment'])

        await router.set('/posts/1/comments/2/?mode=edit')
        expect(router.pathname).toEqual('/posts/1/comments/2/?mode=edit')
        expect(router.params).toEqual([{ id: '1' }, { id: '2' }, { mode: 'edit' }])
        expect(router.active.map((route) => route.name)).toEqual([
          'root',
          'posts',
          'post',
          'comments',
          'comment',
          'mode',
        ])

        await router.set('/posts/1/comments/2/?mode=edit#hash')
        expect(router.pathname).toEqual('/posts/1/comments/2/?mode=edit#hash')
        expect(router.params).toEqual([{ id: '1' }, { id: '2' }, { mode: 'edit' }])
        expect(router.active.map((route) => route.name)).toEqual([
          'root',
          'posts',
          'post',
          'comments',
          'comment',
          'mode',
          'hash',
        ])
      })

      it('without `/` route, with fallback', async () => {
        const router = Router({
          root: ModuleRoute({
            name: 'root',
            children: [
              getPostsRoute([
                FallbackRoute({
                  name: 'posts-404',
                }),
              ]),
              FallbackRoute({
                name: '404',
              }),
            ],
          }),
        })

        await router.set('/foo/')
        expect(router.pathname).toEqual('/foo/')
        expect(router.params).toEqual([])
        expect(router.active.map((route) => route.name)).toEqual(['root', '404'])

        await router.set('/foo/bar/')
        expect(router.pathname).toEqual('/foo/bar/')
        expect(router.params).toEqual([])
        expect(router.active.map((route) => route.name)).toEqual(['root', '404'])

        await router.set('/posts/1/foo/bar/')
        expect(router.pathname).toEqual('/posts/1/foo/bar/')
        expect(router.params).toEqual([{ id: '1' }])
        expect(router.active.map((route) => route.name)).toEqual(['root', 'posts', 'posts-404'])

        await router.set('/')
        expect(router.pathname).toEqual('/')
        expect(router.params).toEqual([])
        expect(router.active.map((route) => route.name)).toEqual(['root', '404'])

        await router.set('/posts/')
        expect(router.pathname).toEqual('/posts/')
        expect(router.params).toEqual([])
        expect(router.active.map((route) => route.name)).toEqual(['root', 'posts'])

        await router.set('/posts/1/')
        expect(router.pathname).toEqual('/posts/1/')
        expect(router.params).toEqual([{ id: '1' }])
        expect(router.active.map((route) => route.name)).toEqual(['root', 'posts', 'post'])

        await router.set('/posts/1/comments/2/')
        expect(router.pathname).toEqual('/posts/1/comments/2/')
        expect(router.params).toEqual([{ id: '1' }, { id: '2' }])
        expect(router.active.map((route) => route.name)).toEqual(['root', 'posts', 'post', 'comments', 'comment'])

        await router.set('/posts/1/comments/2/?mode=edit')
        expect(router.pathname).toEqual('/posts/1/comments/2/?mode=edit')
        expect(router.params).toEqual([{ id: '1' }, { id: '2' }, { mode: 'edit' }])
        expect(router.active.map((route) => route.name)).toEqual([
          'root',
          'posts',
          'post',
          'comments',
          'comment',
          'mode',
        ])

        await router.set('/posts/1/comments/2/?mode=edit#hash')
        expect(router.pathname).toEqual('/posts/1/comments/2/?mode=edit#hash')
        expect(router.params).toEqual([{ id: '1' }, { id: '2' }, { mode: 'edit' }])
        expect(router.active.map((route) => route.name)).toEqual([
          'root',
          'posts',
          'post',
          'comments',
          'comment',
          'mode',
          'hash',
        ])
      })

      it('handles multiple module routes with deep nesting', async () => {
        const router = Router({
          optimistic: true,
          root: ModuleRoute({
            name: 'root',
            children: [
              ModuleRoute({
                name: 'client',
                children: [
                  ModuleRoute({
                    name: 'non-auth',
                    children: [
                      Route({
                        name: 'login',
                        path: 'login/',
                        children: [
                          Route({
                            name: 'reset-success',
                            path: '?resetSuccess',
                          }),
                          Route({
                            name: 'forgot-password',
                            path: 'forgot-password/',
                          }),
                        ],
                      }),
                    ],
                  }),
                  ModuleRoute({
                    name: 'auth',
                    children: [
                      Route({
                        name: 'dashboard',
                        path: 'dashboard/',
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

        await router.set('/login/')
        expect(router.pathname).toEqual('/login/')
        expect(router.params).toEqual([])
        expect(router.active.map((route) => route.name)).toEqual(['root', 'client', 'non-auth', 'login'])

        await router.set('/login/?resetSuccess')
        expect(router.pathname).toEqual('/login/?resetSuccess')
        expect(router.params).toEqual([])
        expect(router.active.map((route) => route.name)).toEqual([
          'root',
          'client',
          'non-auth',
          'login',
          'reset-success',
        ])

        await router.set('/dashboard/')
        expect(router.pathname).toEqual('/dashboard/')
        expect(router.params).toEqual([])
        expect(router.active.map((route) => route.name)).toEqual(['root', 'client', 'auth', 'dashboard'])
      })
    })
  })
})
