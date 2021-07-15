import { Mountable } from './Mountable'

import { omitFunctions } from '../_tests-shared'

describe('`Mountable` route', () => {
  describe('extends', () => {
    const extend = { foo: 'bar' }

    function Extendable() {
      return function () {
        return extend
      }
    }

    it('extends parent', () => {
      const mounted = false
      const options = {}
      const expected = { mounted, ...extend }

      const route = Mountable(Extendable())(options)

      expect(route).not.toBe(extend)
      expect(route).not.toEqual(extend)
      expect(omitFunctions(route)).toEqual(expected)
    })
  })

  describe('options', () => {
    it('immutable and created by options', () => {
      const mounted = false
      const options = {}
      const expected = { mounted }

      const route = Mountable()(options)

      expect(omitFunctions(route)).toEqual(expected)
    })
  })

  describe('methods', () => {
    describe('mount', () => {
      const route = Mountable()({})

      it('mount', async () => {
        expect(route.mounted).toBe(false)
        await route.mount()
        expect(route.mounted).toBe(true)
      })

      it('unmount', async () => {
        expect(route.mounted).toBe(true)
        await route.unmount()
        expect(route.mounted).toBe(false)
      })
    })
  })
})
