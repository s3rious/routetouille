import { Redirectable } from './Redirectable'
import { Mountable, MountableInterface, MountableOptions } from '../Mountable'

import { omitFunctions } from '../_tests-shared'

describe('`Redirectable` route', () => {
  const Route = Redirectable<MountableOptions, MountableInterface>(Mountable())

  describe('extends `Mountable`', () => {
    it('extends', () => {
      const mounted = false
      const expected = { mounted }

      const route = Route({ redirects: [] })

      expect(omitFunctions(route)).toEqual(expected)
    })
  })

  describe('methods', () => {
    describe('mount (without redirects)', () => {
      const route = Route({})

      it('mounts', async () => {
        expect(route.mounted).toBe(false)
        await route.mount()
        expect(route.mounted).toBe(true)
      })
    })

    describe('mount (with redirects)', () => {
      it('mounts', async () => {
        const firstShouldWe = jest.fn().mockImplementation(() => false)
        const firstWhatTo = jest.fn()
        const secondShouldWe = jest.fn().mockImplementation(() => false)
        const secondWhatTo = jest.fn()
        const thirdShouldWe = jest.fn().mockImplementation(() => false)
        const thirdWhatTo = jest.fn()

        const route = Route({
          redirects: [
            [async () => firstShouldWe(), async () => firstWhatTo()],
            [async () => secondShouldWe(), async () => secondWhatTo()],
            [async () => thirdShouldWe(), async () => thirdWhatTo()],
          ],
        })

        expect(route.mounted).toBe(false)
        await route.mount()

        expect(firstShouldWe).toBeCalledTimes(1)
        expect(firstWhatTo).toBeCalledTimes(0)
        expect(secondShouldWe).toBeCalledTimes(1)
        expect(secondWhatTo).toBeCalledTimes(0)
        expect(thirdShouldWe).toBeCalledTimes(1)
        expect(thirdWhatTo).toBeCalledTimes(0)
        expect(route.mounted).toBe(true)
      })

      it('redirected', async () => {
        const firstShouldWe = jest.fn().mockImplementation(() => false)
        const firstWhatTo = jest.fn()
        const secondShouldWe = jest.fn().mockImplementation(() => true)
        const secondWhatTo = jest.fn()
        const thirdShouldWe = jest.fn().mockImplementation(() => true)
        const thirdWhatTo = jest.fn()

        const route = Route({
          redirects: [
            [async () => firstShouldWe(), async () => firstWhatTo()],
            [async () => secondShouldWe(), async () => secondWhatTo()],
            [async () => thirdShouldWe(), async () => thirdWhatTo()],
          ],
        })

        expect(route.mounted).toBe(false)

        await route.mount()

        expect(firstShouldWe).toBeCalledTimes(1)
        expect(firstWhatTo).toBeCalledTimes(0)
        expect(secondShouldWe).toBeCalledTimes(1)
        expect(secondWhatTo).toBeCalledTimes(1)
        expect(thirdShouldWe).toBeCalledTimes(0)
        expect(thirdWhatTo).toBeCalledTimes(0)
        expect(route.mounted).toBe(false)
      })
    })
  })
})
