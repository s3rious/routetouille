import { Subscribable } from './Subscribable'
import { WithActive, WithActiveInterface, WithActiveOptions } from '../WithActive'
import { WithRoot, WithRootInterface, WithRootOptions } from '../WithRoot'
import { WithMap, WithMapInterface, WithMapOptions } from '../WithMap'

import { Route } from '../../Route'

describe('`Subscribable` router', () => {
  const Router = Subscribable<
    WithActiveOptions & WithMapOptions & WithRootOptions,
    WithActiveInterface & WithMapInterface & WithRootInterface
  >(WithActive(WithMap(WithRoot())))
  const signUpRoute = Route({
    name: 'sign-up',
    path: 'sign-up/',
  })
  const loginRoute = Route({
    name: 'login',
    path: 'login/',
  })
  const rootRoute = Route({
    name: 'root',
    path: '/',
    children: [signUpRoute, loginRoute],
  })

  describe('creation', () => {
    it('created with proper methods`', () => {
      const router = Router({ root: rootRoute })
      expect(router.events).toEqual({})
      expect(router.emit).toBeInstanceOf(Function)
      expect(router.on).toBeInstanceOf(Function)
    })
  })

  describe('methods', () => {
    it('`emit`', async () => {
      const beforeActivateCallback = jest.fn()
      const afterActivateCallback = jest.fn()
      const router = Router({})
      router.root = rootRoute
      router.on('beforeActivate', beforeActivateCallback)
      router.on('afterActivate', afterActivateCallback)

      // @ts-expect-error
      router.emit('afterActivate', [rootRoute])
      expect(afterActivateCallback).toBeCalledTimes(1)
      expect(afterActivateCallback).toBeCalledWith([rootRoute])
      expect(beforeActivateCallback).toBeCalledTimes(0)

      // @ts-expect-error
      router.emit('beforeActivate', [rootRoute])
      expect(beforeActivateCallback).toBeCalledTimes(1)
      expect(beforeActivateCallback).toBeCalledWith([rootRoute])
      expect(afterActivateCallback).toBeCalledTimes(1)
    })

    it('`on`', async () => {
      const beforeActivateCallback = jest.fn()
      const afterActivateCallback = jest.fn()
      const router = Router({})
      router.root = rootRoute
      router.on('beforeActivate', beforeActivateCallback)
      router.on('afterActivate', afterActivateCallback)

      await router.activate('login')
      expect(beforeActivateCallback).toBeCalledTimes(1)
      expect(beforeActivateCallback).toBeCalledWith([])
      expect(afterActivateCallback).toBeCalledTimes(1)
      expect(afterActivateCallback).toBeCalledWith([rootRoute, loginRoute])

      await router.activate('sign-up')
      expect(beforeActivateCallback).toBeCalledTimes(2)
      expect(beforeActivateCallback).toBeCalledWith([rootRoute, loginRoute])
      expect(afterActivateCallback).toBeCalledTimes(2)
      expect(afterActivateCallback).toBeCalledWith([rootRoute, signUpRoute])
    })
  })
})
