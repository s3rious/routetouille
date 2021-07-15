import { WithFallback } from './WithFallback'

describe('`WithFallback` route', () => {
  describe('extends', () => {
    const extend = { foo: 'bar' }

    function Extendable() {
      return function () {
        return extend
      }
    }

    it('extends fallback', () => {
      const Route = WithFallback(Extendable())
      const fallback = Route({})
      const expected = { fallback, ...extend }
      const route = Route({ fallback })

      expect(route).not.toBe(extend)
      expect(route).not.toEqual(extend)
      expect(route).toEqual(expected)
    })
  })

  describe('options', () => {
    it('created with passed options', () => {
      const Route = WithFallback()
      const fallback = Route({})
      const options = { fallback }
      const expected = { fallback }

      const route = WithFallback()(options)

      expect(route).toEqual(expected)
    })
  })
})
