import { WithBeforeMount } from './WithBeforeMount'
import { Mountable, MountableInterface, MountableOptions } from '../Mountable'

import { omitFunctions } from '../_tests-shared'

describe('`WithBeforeMount` route', () => {
  const Route = WithBeforeMount<MountableOptions, MountableInterface>(Mountable())

  describe('extends `Mountable`', () => {
    it('extends', () => {
      const mounted = false
      const expected = { mounted }

      const route = Route({})

      expect(omitFunctions(route)).toEqual(expected)
    })
  })

  describe('methods', () => {
    describe('mount (without before)', () => {
      const route = Route({})

      it('mounts', async () => {
        expect(route.mounted).toBe(false)
        await route.mount()
        expect(route.mounted).toBe(true)
      })
    })

    describe('mount (with redirects)', () => {
      it('calls `beforeMount` before mount', async () => {
        jest.useFakeTimers()

        const beforeMountCallback = jest.fn()
        const beforeMount = jest.fn().mockImplementation(
          async () =>
            await new Promise((resolve) => {
              setTimeout(() => {
                beforeMountCallback()
                resolve(null)
              }, 1000)
            }),
        )

        const route = Route({ beforeMount })

        expect(route.mounted).toBe(false)
        expect(beforeMount).toBeCalledTimes(0)
        await Promise.all([route.mount(), jest.runAllTimers()])
        expect(beforeMount).toBeCalledTimes(1)
        expect(beforeMountCallback).toBeCalledTimes(1)
        expect(route.mounted).toBe(true)
      })

      it('error in `beforeMount` interferes with mount', async () => {
        jest.useFakeTimers()

        const beforeMountErrorHandle = jest.fn()
        const beforeMount = jest.fn().mockImplementation(
          async () =>
            await new Promise((resolve, reject) => {
              setTimeout(() => {
                reject(new Error('error'))
              }, 1000)
            }).then(
              () => {},
              async () => {
                beforeMountErrorHandle()

                // eslint-disable-next-line @typescript-eslint/no-throw-literal
                throw 'Error!'
              },
            ),
        )

        const route = Route({ beforeMount })

        try {
          expect(route.mounted).toBe(false)
          expect(beforeMount).toBeCalledTimes(0)

          await Promise.all([route.mount(), jest.runAllTimers()])
        } catch (error) {
          expect(error).toBe('Error!')
        } finally {
          expect(route.mounted).toBe(false)
          expect(beforeMount).toBeCalledTimes(1)
          expect(beforeMountErrorHandle).toBeCalledTimes(1)
        }
      })
    })
  })
})
