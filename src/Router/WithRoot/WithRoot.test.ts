import { WithRoot } from './WithRoot'

import { Route } from '../../Route'

describe('`WithRoot` router', () => {
  describe('creation', () => {
    it('created with proper root', () => {
      const root = Route({ name: 'root', path: '/' })
      const router = WithRoot()({ root })
      const expected = {
        root: {
          name: 'root',
          path: '/',
          mounted: false,
        },
      }

      expect(router.root).toBe(root)
      expect(JSON.stringify(router)).toEqual(JSON.stringify(expected))
    })
  })
})
