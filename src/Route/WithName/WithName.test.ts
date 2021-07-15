import { WithName } from './WithName'

describe('`WithName` route', () => {
  describe('extends', () => {
    const extend = { foo: 'bar' }

    function Extendable() {
      return function () {
        return extend
      }
    }

    it('extends parent', () => {
      const name = 'name'
      const options = { name }
      const expected = { name, ...extend }

      const route = WithName(Extendable())(options)

      expect(route).not.toBe(extend)
      expect(route).not.toEqual(extend)
      expect(route).toEqual(expected)
    })
  })

  describe('options', () => {
    it('created with passed options', () => {
      const name = 'name'
      const options = { name }
      const expected = { name }

      const route = WithName()(options)

      expect(route).toEqual(expected)
    })
  })
})
