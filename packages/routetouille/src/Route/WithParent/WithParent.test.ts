import { WithParent } from './WithParent'

describe('`WithParent` route', () => {
  describe('extends', () => {
    const extend = { foo: 'bar' }

    function Extendable() {
      return function () {
        return extend
      }
    }

    it('extends parent', () => {
      const Route = WithParent(Extendable())
      const parent = Route({})
      const expected = { parent, ...extend }
      const route = Route({ parent })

      expect(route).not.toBe(extend)
      expect(route).not.toEqual(extend)
      expect(route).toEqual(expected)
    })
  })

  describe('options', () => {
    it('created with passed options', () => {
      const Route = WithParent()
      const parent = Route({})
      const options = { parent }
      const expected = { parent }

      const route = WithParent()(options)

      expect(route).toEqual(expected)
    })
  })
})
