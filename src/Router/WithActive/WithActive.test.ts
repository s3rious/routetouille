import Mock = jest.Mock

import { WithActive, WithActiveInterface } from './WithActive'
import { WithRoot, WithRootInterface, WithRootOptions } from '../WithRoot'
import { AbstractRoute, WithMap, WithMapInterface, WithMapOptions } from '../WithMap'

import {
  FallbackRoute,
  FallbackRouteInterface,
  ModuleRoute,
  ModuleRouteInterface,
  Route,
  RouteInterface,
} from '../../Route'

describe('`WithActive` router', () => {
  const Router = WithActive<WithMapOptions & WithRootOptions, WithMapInterface & WithRootInterface>(WithMap(WithRoot()))

  describe('creation', () => {
    it('created with proper `active`', () => {
      const root = Route({ name: 'root', path: '/' })
      const router = Router({ root })

      expect(router.active).toEqual([])
    })
  })

  describe('methods', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getActiveRoutesName = (router: any): any => router.active.map((route: AbstractRoute) => route.name)
    const waitFor = async (time: number = 0): Promise<unknown> =>
      await new Promise((resolve) => setTimeout(() => resolve(null), time))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockBefore = (): Mock<any, any> =>
      jest.fn().mockImplementation(async () => await new Promise((resolve) => resolve(null)))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockAfter = (): Mock<any, any> =>
      jest.fn().mockImplementation(async () => await new Promise((resolve) => setTimeout(() => resolve(null), 1)))

    let allowedToVisitAdmin = false
    let adminBeforeMount: () => Promise<void>
    let adminAfterMount: () => Promise<void>
    let adminBeforeUnmount: () => Promise<void>
    let adminAfterUnmount: () => Promise<void>
    let admin: RouteInterface
    let optimisticAdminBeforeMount: () => Promise<void>
    let optimisticAdminAfterMount: () => Promise<void>
    let optimisticAdminBeforeUnmount: () => Promise<void>
    let optimisticAdminAfterUnmount: () => Promise<void>
    let optimisticAdmin: RouteInterface
    let authInfoBeforeMount: () => Promise<void>
    let authInfoAfterMount: () => Promise<void>
    let authInfoBeforeUnmount: () => Promise<void>
    let authInfoAfterUnmount: () => Promise<void>
    let authInfo: RouteInterface
    let dashboardFallbackBeforeMount: () => Promise<void>
    let dashboardFallbackAfterMount: () => Promise<void>
    let dashboardFallbackBeforeUnmount: () => Promise<void>
    let dashboardFallbackAfterUnmount: () => Promise<void>
    let dashboardFallback: FallbackRouteInterface
    let dashboardBeforeMount: () => Promise<void>
    let dashboardAfterMount: () => Promise<void>
    let dashboardBeforeUnmount: () => Promise<void>
    let dashboardAfterUnmount: () => Promise<void>
    let dashboard: RouteInterface
    let authBeforeMount: () => Promise<void>
    let authAfterMount: () => Promise<void>
    let authBeforeUnmount: () => Promise<void>
    let authAfterUnmount: () => Promise<void>
    let auth: ModuleRouteInterface
    let nonAuthInfoBeforeMount: () => Promise<void>
    let nonAuthInfoAfterMount: () => Promise<void>
    let nonAuthInfoBeforeUnmount: () => Promise<void>
    let nonAuthInfoAfterUnmount: () => Promise<void>
    let nonAuthInfo: RouteInterface
    let signUpBeforeMount: () => Promise<void>
    let signUpAfterMount: () => Promise<void>
    let signUpBeforeUnmount: () => Promise<void>
    let signUpAfterUnmount: () => Promise<void>
    let signUp: RouteInterface
    let loginBeforeMount: () => Promise<void>
    let loginAfterMount: () => Promise<void>
    let loginBeforeUnmount: () => Promise<void>
    let loginAfterUnmount: () => Promise<void>
    let login: RouteInterface
    let nonAuthBeforeMount: () => Promise<void>
    let nonAuthAfterMount: () => Promise<void>
    let nonAuthBeforeUnmount: () => Promise<void>
    let nonAuthAfterUnmount: () => Promise<void>
    let nonAuth: ModuleRouteInterface
    let rootFallbackBeforeMount: () => Promise<void>
    let rootFallbackAfterMount: () => Promise<void>
    let rootFallbackBeforeUnmount: () => Promise<void>
    let rootFallbackAfterUnmount: () => Promise<void>
    let rootFallback: FallbackRouteInterface
    let rootBeforeMount: () => Promise<void>
    let rootAfterMount: () => Promise<void>
    let rootBeforeUnmount: () => Promise<void>
    let rootAfterUnmount: () => Promise<void>
    let root: RouteInterface
    let optimisticRootBeforeMount: () => Promise<void>
    let optimisticRootAfterMount: () => Promise<void>
    let optimisticRootBeforeUnmount: () => Promise<void>
    let optimisticRootAfterUnmount: () => Promise<void>
    let optimisticRoot: RouteInterface
    let router: WithActiveInterface & WithMapInterface & WithRootInterface
    let optimisticRouter: WithActiveInterface & WithMapInterface & WithRootInterface

    beforeEach(() => {
      adminBeforeMount = mockBefore()
      adminAfterMount = mockAfter()
      adminBeforeUnmount = mockBefore()
      adminAfterUnmount = mockAfter()
      admin = Route({
        name: 'admin',
        path: 'admin/',
        beforeMount: adminBeforeMount,
        afterMount: adminAfterMount,
        beforeUnmount: adminBeforeUnmount,
        afterUnmount: adminAfterUnmount,
        redirects: [[async () => !allowedToVisitAdmin, async () => await router.activate('login', false)]],
      })
      optimisticAdminBeforeMount = mockBefore()
      optimisticAdminAfterMount = mockAfter()
      optimisticAdminBeforeUnmount = mockBefore()
      optimisticAdminAfterUnmount = mockAfter()
      optimisticAdmin = Route({
        name: 'admin',
        path: 'admin/',
        beforeMount: optimisticAdminBeforeMount,
        afterMount: optimisticAdminAfterMount,
        beforeUnmount: optimisticAdminBeforeUnmount,
        afterUnmount: optimisticAdminAfterUnmount,
        redirects: [[async () => !allowedToVisitAdmin, async () => await optimisticRouter.activate('login', false)]],
      })
      authInfoBeforeMount = mockBefore()
      authInfoAfterMount = mockAfter()
      authInfoBeforeUnmount = mockBefore()
      authInfoAfterUnmount = mockAfter()
      authInfo = Route({
        name: 'info',
        path: 'info/',
        beforeMount: authInfoBeforeMount,
        afterMount: authInfoAfterMount,
        beforeUnmount: authInfoBeforeUnmount,
        afterUnmount: authInfoAfterUnmount,
      })
      dashboardFallbackBeforeMount = mockBefore()
      dashboardFallbackAfterMount = mockBefore()
      dashboardFallbackBeforeUnmount = mockBefore()
      dashboardFallbackAfterUnmount = mockBefore()
      dashboardFallback = FallbackRoute({
        name: 'dashboard-404',
        beforeMount: dashboardFallbackBeforeMount,
        afterMount: dashboardFallbackAfterMount,
        beforeUnmount: dashboardFallbackBeforeUnmount,
        afterUnmount: dashboardFallbackAfterUnmount,
      })
      dashboardBeforeMount = mockBefore()
      dashboardAfterMount = mockAfter()
      dashboardBeforeUnmount = mockBefore()
      dashboardAfterUnmount = mockAfter()
      dashboard = Route({
        name: 'dashboard',
        path: 'dashboard/',
        beforeMount: dashboardBeforeMount,
        afterMount: dashboardAfterMount,
        beforeUnmount: dashboardBeforeUnmount,
        afterUnmount: dashboardAfterUnmount,
        children: [dashboardFallback],
      })
      authBeforeMount = mockBefore()
      authAfterMount = mockAfter()
      authBeforeUnmount = mockBefore()
      authAfterUnmount = mockAfter()
      auth = ModuleRoute({
        name: 'auth',
        beforeMount: authBeforeMount,
        afterMount: authAfterMount,
        beforeUnmount: authBeforeUnmount,
        afterUnmount: authAfterUnmount,
        children: [dashboard, authInfo],
      })
      nonAuthInfoBeforeMount = mockBefore()
      nonAuthInfoAfterMount = mockAfter()
      nonAuthInfoBeforeUnmount = mockBefore()
      nonAuthInfoAfterUnmount = mockAfter()
      nonAuthInfo = Route({
        name: 'info',
        path: 'info/',
        beforeMount: nonAuthInfoBeforeMount,
        afterMount: nonAuthInfoAfterMount,
        beforeUnmount: nonAuthInfoBeforeUnmount,
        afterUnmount: nonAuthInfoAfterUnmount,
      })
      signUpBeforeMount = mockBefore()
      signUpAfterMount = mockAfter()
      signUpBeforeUnmount = mockBefore()
      signUpAfterUnmount = mockAfter()
      signUp = Route({
        name: 'sign-up',
        path: 'sign-up/',
        beforeMount: signUpBeforeMount,
        afterMount: signUpAfterMount,
        beforeUnmount: signUpBeforeUnmount,
        afterUnmount: signUpAfterUnmount,
      })
      loginBeforeMount = mockBefore()
      loginAfterMount = mockAfter()
      loginBeforeUnmount = mockBefore()
      loginAfterUnmount = mockAfter()
      login = Route({
        name: 'login',
        path: 'login/',
        beforeMount: loginBeforeMount,
        afterMount: loginAfterMount,
        beforeUnmount: loginBeforeUnmount,
        afterUnmount: loginAfterUnmount,
      })
      nonAuthBeforeMount = mockBefore()
      nonAuthAfterMount = mockAfter()
      nonAuthBeforeUnmount = mockBefore()
      nonAuthAfterUnmount = mockAfter()
      nonAuth = ModuleRoute({
        name: 'non-auth',
        beforeMount: nonAuthBeforeMount,
        afterMount: nonAuthAfterMount,
        beforeUnmount: nonAuthBeforeUnmount,
        afterUnmount: nonAuthAfterUnmount,
        children: [login, signUp, nonAuthInfo],
      })
      rootFallbackBeforeMount = mockBefore()
      rootFallbackAfterMount = mockBefore()
      rootFallbackBeforeUnmount = mockBefore()
      rootFallbackAfterUnmount = mockBefore()
      rootFallback = FallbackRoute({
        name: '404',
        beforeMount: rootFallbackBeforeMount,
        afterMount: rootFallbackAfterMount,
        beforeUnmount: rootFallbackBeforeUnmount,
        afterUnmount: rootFallbackAfterUnmount,
      })
      rootBeforeMount = mockBefore()
      rootAfterMount = mockAfter()
      rootBeforeUnmount = mockBefore()
      rootAfterUnmount = mockAfter()
      root = Route({
        name: 'root',
        path: '/',
        beforeMount: rootBeforeMount,
        afterMount: rootAfterMount,
        beforeUnmount: rootBeforeUnmount,
        afterUnmount: rootAfterUnmount,
        children: [rootFallback, nonAuth, auth, admin],
      })
      optimisticRootBeforeMount = mockBefore()
      optimisticRootAfterMount = mockAfter()
      optimisticRootBeforeUnmount = mockBefore()
      optimisticRootAfterUnmount = mockAfter()
      optimisticRoot = Route({
        name: 'root',
        path: '/',
        beforeMount: optimisticRootBeforeMount,
        afterMount: optimisticRootAfterMount,
        beforeUnmount: optimisticRootBeforeUnmount,
        afterUnmount: optimisticRootAfterUnmount,
        children: [rootFallback, nonAuth, auth, optimisticAdmin],
      })
      router = Router({ root })
      optimisticRouter = Router({ root: optimisticRoot, optimistic: true })
    })

    describe('`activate`', () => {
      describe('`activator`', () => {
        describe('string', () => {
          it('exact `name`', async () => {
            expect(getActiveRoutesName(router)).toEqual([])

            await router.activate('login')
            expect(getActiveRoutesName(router)).toEqual(['root', 'non-auth', 'login'])
            expect(rootBeforeMount).toBeCalledTimes(1)
            expect(nonAuthBeforeMount).toBeCalledTimes(1)
            expect(loginBeforeMount).toBeCalledTimes(1)
            expect(rootAfterMount).toBeCalledTimes(0)
            expect(nonAuthAfterMount).toBeCalledTimes(0)
            expect(loginAfterMount).toBeCalledTimes(0)

            await waitFor(1)
            expect(rootAfterMount).toBeCalledTimes(1)
            expect(nonAuthAfterMount).toBeCalledTimes(1)
            expect(loginAfterMount).toBeCalledTimes(1)
          })

          it('`name`’s joined with `.`', async () => {
            await router.activate('root.auth.info')
            expect(getActiveRoutesName(router)).toEqual(['root', 'auth', 'info'])
          })
        })

        describe('array of strings', () => {
          it('multiple', async () => {
            await router.activate(['root', 'auth', 'info'])
            expect(getActiveRoutesName(router)).toEqual(['root', 'auth', 'info'])
          })

          it('singular', async () => {
            await router.activate(['info'])
            expect(getActiveRoutesName(router)).toEqual(['root', 'non-auth', 'info'])
          })

          it('unmatched', async () => {
            await router.activate([])
            expect(getActiveRoutesName(router)).toEqual(['root', '404'])

            await router.activate([null])
            expect(getActiveRoutesName(router)).toEqual(['root', '404'])

            await router.activate(['foo'])
            expect(getActiveRoutesName(router)).toEqual(['root', '404'])

            await router.activate(['foo', 'bar'])
            expect(getActiveRoutesName(router)).toEqual(['root', '404'])

            await router.activate(['foo', null])
            expect(getActiveRoutesName(router)).toEqual(['root', '404'])

            await router.activate(['root', 'auth', 'dashboard', 'foo'])
            expect(getActiveRoutesName(router)).toEqual(['root', 'auth', 'dashboard', 'dashboard-404'])

            await router.activate(['root', 'auth', 'dashboard', null])
            expect(getActiveRoutesName(router)).toEqual(['root', 'auth', 'dashboard', 'dashboard-404'])

            const anotherRouter = Router({
              root: Route({
                name: 'root',
                path: '/',
                children: [
                  Route({
                    name: 'foo',
                    path: 'foo/',
                    children: [
                      FallbackRoute({
                        name: '404',
                      }),
                    ],
                  }),
                ],
              }),
            })

            await anotherRouter.activate(['death'])
            expect(getActiveRoutesName(anotherRouter)).toEqual(['root', 'foo', '404'])

            const yetAnotherRouter = Router({
              root: Route({
                name: 'root',
                path: '/',
                children: [
                  Route({
                    name: 'foo',
                    path: 'foo/',
                  }),
                  Route({
                    name: 'bar',
                    path: 'bar/',
                    children: [
                      Route({
                        name: 'baz',
                        path: 'baz/',
                      }),
                    ],
                  }),
                ],
              }),
            })

            await yetAnotherRouter.activate(['baz', 'quz'])
            expect(getActiveRoutesName(yetAnotherRouter)).toEqual([])
          })
        })
      })

      describe('wrong', () => {
        it('null', async () => {
          // @ts-expect-error
          await router.activate(null)
          expect(getActiveRoutesName(router)).toEqual([])
        })

        it('undefined', async () => {
          // @ts-expect-error
          await router.activate(undefined)
          expect(getActiveRoutesName(router)).toEqual([])
        })

        it('object', async () => {
          // @ts-expect-error
          await router.activate({})
          expect(getActiveRoutesName(router)).toEqual([])
        })
      })

      it('calls `mount` and `unmount` only to a diff between current `active` and next `active` routes', async () => {
        await router.activate('login')
        await router.activate('sign-up')

        expect(getActiveRoutesName(router)).toEqual(['root', 'non-auth', 'sign-up'])
        expect(loginBeforeUnmount).toBeCalledTimes(1)
        expect(nonAuthBeforeUnmount).toBeCalledTimes(0)
        expect(rootBeforeUnmount).toBeCalledTimes(0)
        expect(loginAfterUnmount).toBeCalledTimes(0)
        expect(rootBeforeMount).toBeCalledTimes(1)
        expect(nonAuthBeforeMount).toBeCalledTimes(1)
        expect(signUpBeforeMount).toBeCalledTimes(1)
        expect(signUpAfterMount).toBeCalledTimes(0)

        await waitFor(1)
        expect(loginAfterUnmount).toBeCalledTimes(1)
        expect(signUpAfterMount).toBeCalledTimes(1)
      })

      it('`redirects` will interfere with `mount`', async () => {
        await router.activate('admin')
        expect(getActiveRoutesName(router)).toEqual(['root', 'non-auth', 'login'])
        expect(adminBeforeMount).toBeCalledTimes(1)
        expect(adminAfterMount).toBeCalledTimes(0)
        expect(loginBeforeMount).toBeCalledTimes(1)

        await waitFor(1)
        expect(adminBeforeMount).toBeCalledTimes(1)
        expect(adminAfterMount).toBeCalledTimes(0)
        expect(adminBeforeUnmount).toBeCalledTimes(0)
        expect(adminAfterUnmount).toBeCalledTimes(0)
        expect(loginAfterMount).toBeCalledTimes(1)
      })

      it('if `redirects` returns `false` it successfully `mount`’s a route', async () => {
        allowedToVisitAdmin = true

        await router.activate('admin')
        expect(adminBeforeMount).toBeCalledTimes(1)
        expect(adminAfterMount).toBeCalledTimes(0)
        expect(getActiveRoutesName(router)).toEqual(['root', 'admin'])

        await waitFor(1)
        expect(adminAfterMount).toBeCalledTimes(1)

        allowedToVisitAdmin = false
      })
    })

    describe('optimistic', () => {
      describe('`activate`', () => {
        it('via param', async () => {
          expect(getActiveRoutesName(router)).toEqual([])

          await router.activate('login', true)
          expect(getActiveRoutesName(router)).toEqual(['root', 'non-auth', 'login'])
          expect(rootBeforeMount).toBeCalledTimes(0)
          expect(nonAuthBeforeMount).toBeCalledTimes(0)
          expect(loginBeforeMount).toBeCalledTimes(0)

          await waitFor(1)
          expect(getActiveRoutesName(router)).toEqual(['root', 'non-auth', 'login'])
          expect(rootBeforeMount).toBeCalledTimes(1)
          expect(nonAuthBeforeMount).toBeCalledTimes(1)
          expect(loginBeforeMount).toBeCalledTimes(1)
        })

        it('via router option', async () => {
          expect(getActiveRoutesName(optimisticRouter)).toEqual([])

          await optimisticRouter.activate('login')
          expect(getActiveRoutesName(optimisticRouter)).toEqual(['root', 'non-auth', 'login'])
          expect(optimisticRootBeforeMount).toBeCalledTimes(0)
          expect(nonAuthBeforeMount).toBeCalledTimes(0)
          expect(loginBeforeMount).toBeCalledTimes(0)

          await waitFor(1)
          expect(getActiveRoutesName(optimisticRouter)).toEqual(['root', 'non-auth', 'login'])
          expect(optimisticRootBeforeMount).toBeCalledTimes(1)
          expect(nonAuthBeforeMount).toBeCalledTimes(1)
          expect(loginBeforeMount).toBeCalledTimes(1)
        })

        describe('handles redirect', () => {
          it('via param', async () => {
            expect(getActiveRoutesName(router)).toEqual([])

            await router.activate('admin', true)
            expect(getActiveRoutesName(router)).toEqual(['root', 'admin'])
            expect(adminBeforeMount).toBeCalledTimes(0)
            expect(adminAfterMount).toBeCalledTimes(0)
            expect(loginBeforeMount).toBeCalledTimes(0)
            expect(loginAfterMount).toBeCalledTimes(0)

            await waitFor(1)
            expect(getActiveRoutesName(router)).toEqual(['root', 'non-auth', 'login'])
            expect(adminBeforeMount).toBeCalledTimes(1)
            expect(adminAfterMount).toBeCalledTimes(0)
            expect(adminBeforeUnmount).toBeCalledTimes(1)
            expect(adminAfterUnmount).toBeCalledTimes(0)
            expect(loginBeforeMount).toBeCalledTimes(1)
            expect(loginAfterMount).toBeCalledTimes(0)

            await waitFor(1)
            expect(loginAfterMount).toBeCalledTimes(1)
          })

          it('via router option', async () => {
            expect(getActiveRoutesName(optimisticRouter)).toEqual([])

            await optimisticRouter.activate('admin')
            expect(getActiveRoutesName(optimisticRouter)).toEqual(['root', 'admin'])
            expect(optimisticAdminBeforeMount).toBeCalledTimes(0)
            expect(optimisticAdminAfterMount).toBeCalledTimes(0)
            expect(loginBeforeMount).toBeCalledTimes(0)
            expect(loginAfterMount).toBeCalledTimes(0)

            await waitFor(1)
            expect(getActiveRoutesName(optimisticRouter)).toEqual(['root', 'non-auth', 'login'])
            expect(optimisticAdminBeforeMount).toBeCalledTimes(1)
            expect(optimisticAdminAfterMount).toBeCalledTimes(0)
            expect(optimisticAdminBeforeUnmount).toBeCalledTimes(1)
            expect(optimisticAdminAfterUnmount).toBeCalledTimes(0)
            expect(loginBeforeMount).toBeCalledTimes(1)
            expect(loginAfterMount).toBeCalledTimes(0)

            await waitFor(1)
            expect(loginAfterMount).toBeCalledTimes(1)
          })
        })
      })
    })
  })
})
