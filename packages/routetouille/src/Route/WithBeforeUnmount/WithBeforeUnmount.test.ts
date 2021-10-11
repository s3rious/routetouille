import { WithBeforeUnmount } from './WithBeforeUnmount'
import { Mountable, MountableInterface, MountableOptions } from '../Mountable'

describe('`WithBeforeUnmount` route', () => {
  const Route = WithBeforeUnmount<MountableOptions, MountableInterface>(Mountable())

  describe('extends `Mountable`', () => {
    it('extends', () => {
      const mounted = false
      const expected = { mounted }

      const route = Route({})

      expect(JSON.stringify(route)).toEqual(JSON.stringify(expected))
    })
  })

  describe('methods', () => {
    describe('`unmount` (without `beforeUnmount`)', () => {
      const route = Route({})

      it('mounts', async () => {
        await route.mount()
        expect(route.mounted).toBe(true)
        await route.unmount()
        expect(route.mounted).toBe(false)
      })
    })

    describe('unmount (with `beforeUnmount)', () => {
      it('calls `beforeUnmount` before `unmount`', async () => {
        jest.useFakeTimers()

        const beforeUnmountCallback = jest.fn()
        const beforeUnmount = jest.fn().mockImplementation(
          async () =>
            await new Promise((resolve) => {
              setTimeout(() => {
                beforeUnmountCallback()
                resolve(null)
              }, 1000)
            }),
        )

        const route = Route({ beforeUnmount })

        expect(route.mounted).toBe(false)
        expect(beforeUnmount).toBeCalledTimes(0)
        await Promise.all([route.unmount(), jest.runAllTimers()])
        expect(beforeUnmount).toBeCalledTimes(1)
        expect(beforeUnmountCallback).toBeCalledTimes(1)
        expect(route.mounted).toBe(false)
      })

      it('error in `beforeUnmount` interferes with mount', async () => {
        jest.useFakeTimers()

        const beforeUnmountErrorHandle = jest.fn()
        const beforeUnmount = jest.fn().mockImplementation(
          async () =>
            await new Promise((resolve, reject) => {
              setTimeout(() => {
                reject(new Error('error'))
              }, 1000)
            }).then(
              () => {},
              async () => {
                beforeUnmountErrorHandle()

                // eslint-disable-next-line @typescript-eslint/no-throw-literal
                throw 'Error!'
              },
            ),
        )

        const route = Route({ beforeUnmount })

        try {
          await route.mount()
          expect(route.mounted).toBe(true)
          expect(beforeUnmount).toBeCalledTimes(0)

          await Promise.all([route.unmount(), jest.runAllTimers()])
        } catch (error) {
          expect(error).toBe('Error!')
        } finally {
          expect(route.mounted).toBe(true)
          expect(beforeUnmount).toBeCalledTimes(1)
          expect(beforeUnmountErrorHandle).toBeCalledTimes(1)
        }
      })
    })
  })
})
