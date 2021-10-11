import { WithParams } from './WithParams'
import { WithPathname, WithPathnameInterface, WithPathnameOptions } from '../WithPathname'
import { WithActive, WithActiveInterface, WithActiveOptions } from '../WithActive'
import { WithRoot, WithRootInterface, WithRootOptions } from '../WithRoot'
import { WithMap, WithMapInterface, WithMapOptions } from '../WithMap'

import { Route } from '../../Route'

type RouterComposedOptions = WithPathnameOptions & WithActiveOptions & WithMapOptions & WithRootOptions
type RouterComposedInterface = WithPathnameInterface & WithActiveInterface & WithMapInterface & WithRootInterface

describe('`WithParams` router', () => {
  const Router = WithParams<RouterComposedOptions, RouterComposedInterface>(
    WithPathname(WithActive(WithMap(WithRoot()))),
  )

  describe('creation', () => {
    it('created with proper `active`', () => {
      const root = Route({ name: 'root', path: '/' })
      const router = Router({ root })

      expect(router.pathname).toEqual(null)
    })
  })

  describe('methods', () => {
    it('`activate`', async () => {
      const router = Router({
        root: Route({
          name: 'root',
          path: '/',
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

      await router.activate('post.comments.comment.mode', [{ id: '1' }, { id: '2' }, { mode: 'edit' }])

      expect(router.params).toEqual([{ id: '1' }, { id: '2' }, { mode: 'edit' }])
      expect(router.pathname).toEqual('/1/comments/2/?mode=edit')
    })
  })
})
