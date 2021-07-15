import { WithRoute } from './WithRoute'

describe('`WithRoute` route', () => {
  describe('extends', () => {
    const extend = { foo: 'bar' }

    function Extendable() {
      return function () {
        return extend
      }
    }

    it('extends route', () => {
      const Route = WithRoute(Extendable())
      const internalRoute = Route({})
      const expected = { route: internalRoute, ...extend }
      const route = Route({ route: internalRoute })

      expect(route).not.toBe(extend)
      expect(route).not.toEqual(extend)
      expect(route).toEqual(expected)
    })
  })

  describe('options', () => {
    it('created with passed options', () => {
      const Route = WithRoute()
      const internalRoute = Route({})
      const options = { route: internalRoute }
      const expected = { route: internalRoute }

      const route = WithRoute()(options)

      expect(route).toEqual(expected)
    })
  })
})
