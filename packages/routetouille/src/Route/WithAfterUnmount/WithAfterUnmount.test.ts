import { WithAfterUnmount } from './WithAfterUnmount'
import { Mountable, MountableInterface, MountableOptions } from '../Mountable'

describe('`WithAfterUnmount` route', () => {
  const Route = WithAfterUnmount<MountableOptions, MountableInterface>(Mountable())

  describe('extends `Mountable`', () => {
    it('extends', () => {
      const mounted = false
      const expected = { mounted }

      const route = Route({})

      expect(JSON.stringify(route)).toEqual(JSON.stringify(expected))
    })
  })

  describe('methods', () => {
    describe('`unmount` (without `afterUnmount`)', () => {
      const route = Route({})

      it('mounts', async () => {
        await route.unmount()
        expect(route.mounted).toBe(false)
      })
    })

    describe('`unmount` (with `afterUnmount`)', () => {
      it('calls `afterUnmount` after `unmount`', async () => {
        jest.useFakeTimers()

        const afterUnmountCallback = jest.fn()
        const afterUnmount = jest.fn().mockImplementation(
          async () =>
            await new Promise((resolve) => {
              setTimeout(() => {
                afterUnmountCallback()
                resolve(null)
              }, 1000)
            }),
        )

        const route = Route({ afterUnmount })

        expect(afterUnmount).toBeCalledTimes(0)
        await route.unmount()
        expect(route.mounted).toBe(false)
        expect(afterUnmount).toBeCalledTimes(0)
        expect(afterUnmountCallback).toBeCalledTimes(0)

        jest.runAllTimers()

        expect(afterUnmount).toBeCalledTimes(1)
        expect(afterUnmountCallback).toBeCalledTimes(1)
      })

      it('error in `afterUnmount` does not interfere with mount', async () => {
        jest.useFakeTimers()

        const afterUnmountErrorHandle = jest.fn()
        const afterUnmount = jest.fn().mockImplementation(
          async () =>
            await new Promise((resolve, reject) => {
              setTimeout(() => {
                reject(new Error('error'))
              }, 1000)
            }).then(
              () => {},
              async () => {
                afterUnmountErrorHandle()
              },
            ),
        )

        const route = Route({ afterUnmount })

        await route.mount()
        expect(route.mounted).toBe(true)
        expect(afterUnmount).toBeCalledTimes(0)
        await route.unmount()
        expect(route.mounted).toBe(false)
        expect(afterUnmount).toBeCalledTimes(0)
        expect(afterUnmountErrorHandle).toBeCalledTimes(0)

        await jest.runAllTimers()

        expect(afterUnmount).toBeCalledTimes(1)
        expect(afterUnmountErrorHandle).toBeCalledTimes(1)
      })
    })
  })
})
