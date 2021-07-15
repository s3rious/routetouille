import { WithSlug, Slug } from './WithSlug'

import { omitFunctions } from '../../_tests-shared'

describe('`WithSlug` route', () => {
  describe('extends', () => {
    const extend = { foo: 'bar' }

    function Extendable() {
      return function () {
        return extend
      }
    }

    it('extends parent', () => {
      const path: Slug = 'path/'
      const options = { path }
      const expected = { path, ...extend }

      const route = WithSlug(Extendable())(options)

      expect(route).not.toBe(extend)
      expect(route).not.toEqual(extend)
      expect(omitFunctions(route)).toEqual(expected)
    })
  })

  describe('options', () => {
    it('created with passed options', () => {
      const path: Slug = 'path/'
      const options = { path }
      const expected = { path }

      const route = WithSlug()(options)

      expect(omitFunctions(route)).toEqual(expected)
    })
  })

  describe('methods', () => {
    describe('match', () => {
      describe('exact', () => {
        const route = WithSlug()({ path: 'path/' })

        it('matches', () => {
          expect(route.match('path/')).toBe(true)
        })

        it('returns false if not matches', () => {
          expect(route.match('different-path/')).toBe(false)
        })
      })

      describe('params', () => {
        it('matches and returns matched params', () => {
          expect(WithSlug()({ path: ':id/' }).match('42/')).toEqual({ id: '42' })
          expect(WithSlug()({ path: 'foo-:id/' }).match('foo-42/')).toEqual({ id: '42' })
          expect(WithSlug()({ path: ':foo-:bar/' }).match('baz-quz/')).toEqual({ foo: 'baz', bar: 'quz' })
        })
      })
    })
  })
})
