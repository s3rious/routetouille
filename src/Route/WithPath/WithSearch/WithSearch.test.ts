import { WithSearch, Search } from './WithSearch'

import { omitFunctions } from '../../_tests-shared'

describe('`WithSearch` route', () => {
  describe('extends', () => {
    const extend = { foo: 'bar' }

    function Extendable() {
      return function () {
        return extend
      }
    }

    it('extends parent', () => {
      const path: Search = '?foo=bar'
      const options = { path }
      const expected = { path, ...extend }

      const route = WithSearch(Extendable())(options)

      expect(route).not.toBe(extend)
      expect(route).not.toEqual(extend)
      expect(omitFunctions(route)).toEqual(expected)
    })
  })

  describe('options', () => {
    it('created with passed options', () => {
      const path: Search = '?foo=bar'
      const options = { path }
      const expected = { path }

      const route = WithSearch()(options)

      expect(omitFunctions(route)).toEqual(expected)
    })
  })

  describe('methods', () => {
    describe('match', () => {
      describe('exact', () => {
        const withoutValue = WithSearch()({ path: '?foo' })
        const withValue = WithSearch()({ path: '?foo=bar' })

        it('matches', () => {
          expect(withoutValue.match('?foo')).toBe(true)
          expect(withoutValue.match('&foo')).toBe(true)
          expect(withValue.match('?foo=bar')).toBe(true)
          expect(withValue.match('&foo=bar')).toBe(true)
        })

        it('returns false if not matches', () => {
          expect(withValue.match('?foo')).toBe(false)
          expect(withValue.match('&foo')).toBe(false)
          expect(withoutValue.match('?foo=bar')).toBe(false)
          expect(withoutValue.match('&foo=bar')).toBe(false)
          expect(withValue.match('?bar')).toBe(false)
          expect(withValue.match('?bar=foo')).toBe(false)
        })
      })

      describe('params', () => {
        it('returns false if not matches', () => {
          expect(WithSearch()({ path: '?:id' }).match('?42')).toEqual({ id: '42' })
          expect(WithSearch()({ path: '?foo-:id' }).match('?foo-42')).toEqual({ id: '42' })
          expect(WithSearch()({ path: '?foo=:id' }).match('?foo=42')).toEqual({ id: '42' })
          expect(WithSearch()({ path: '?:id=bar' }).match('?42=bar')).toEqual({ id: '42' })
          expect(WithSearch()({ path: '?:foo=:bar' }).match('?baz=quz')).toEqual({ foo: 'baz', bar: 'quz' })
        })
      })
    })
  })
})
