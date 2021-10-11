import { WithChildren } from './WithChildren'

describe('`WithChildren` route', () => {
  describe('extends', () => {
    const extend = { foo: 'bar' }

    function Extendable() {
      return function () {
        return extend
      }
    }

    it('extends parent', () => {
      const Route = WithChildren(Extendable())
      const children = [Route({})]
      const expected = { children, ...extend }
      const route = Route({ children })

      expect(route).not.toBe(extend)
      expect(route).not.toEqual(extend)
      expect(route).toEqual(expected)
    })
  })

  describe('options', () => {
    it('created with passed options', () => {
      const Route = WithChildren()
      const children = [Route({})]
      const options = { children }
      const expected = { children }

      const route = WithChildren()(options)

      expect(route).toEqual(expected)
    })
  })
})
