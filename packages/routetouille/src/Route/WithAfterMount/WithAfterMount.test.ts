import { WithAfterMount } from './WithAfterMount'
import { Mountable, MountableInterface, MountableOptions } from '../Mountable'

import { omitFunctions } from '../_tests-shared'

describe('`WithAfterMount` route', () => {
  const Route = WithAfterMount<MountableOptions, MountableInterface>(Mountable())

  describe('extends `Mountable`', () => {
    it('extends', () => {
      const mounted = false
      const expected = { mounted }

      const route = Route({})

      expect(omitFunctions(route)).toEqual(expected)
    })
  })

  describe('methods', () => {
    describe('mount (without after)', () => {
      const route = Route({})

      it('mounts', async () => {
        expect(route.mounted).toBe(false)
        await route.mount()
        expect(route.mounted).toBe(true)
      })
    })

    describe('mount (with redirects)', () => {
      it('calls `afterMount` after mount', async () => {
        jest.useFakeTimers()

        const afterMountCallback = jest.fn()
        const afterMount = jest.fn().mockImplementation(
          async () =>
            await new Promise((resolve) => {
              setTimeout(() => {
                afterMountCallback()
                resolve(null)
              }, 1000)
            }),
        )

        const route = Route({ afterMount })

        expect(route.mounted).toBe(false)
        expect(afterMount).toBeCalledTimes(0)
        await route.mount()
        expect(route.mounted).toBe(true)
        expect(afterMount).toBeCalledTimes(0)
        expect(afterMountCallback).toBeCalledTimes(0)

        jest.runAllTimers()

        expect(afterMount).toBeCalledTimes(1)
        expect(afterMountCallback).toBeCalledTimes(1)
      })

      it('error in `afterMount` does not interfere with mount', async () => {
        jest.useFakeTimers()
        const afterMountErrorHandle = jest.fn()
        const afterMount = jest.fn().mockImplementation(
          async () =>
            await new Promise((resolve, reject) => {
              setTimeout(() => {
                reject(new Error('error'))
              }, 1000)
            }).then(
              () => {},
              async () => {
                afterMountErrorHandle()
              },
            ),
        )

        const route = Route({ afterMount })

        expect(route.mounted).toBe(false)
        expect(afterMount).toBeCalledTimes(0)
        await route.mount()
        expect(route.mounted).toBe(true)
        expect(afterMount).toBeCalledTimes(0)
        expect(afterMountErrorHandle).toBeCalledTimes(0)

        await jest.runAllTimers()

        expect(afterMount).toBeCalledTimes(1)
        expect(afterMountErrorHandle).toBeCalledTimes(1)
      })
    })
  })
})
