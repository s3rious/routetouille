import { WithMap } from './WithMap'
import { WithRoot, WithRootInterface, WithRootOptions } from '../WithRoot'

import { FallbackRoute, ModuleRoute, Route } from '../../Route'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function replacer(jsonKey: any, jsonValue: any): any {
  if (jsonValue instanceof Map) {
    return [...jsonValue]
  }

  return jsonValue
}

describe('`WithMap` router', () => {
  const Router = WithMap<WithRootOptions, WithRootInterface>(WithRoot())
  const root = Route({
    name: 'root',
    path: '/',
    children: [
      FallbackRoute({
        name: '404',
      }),
      ModuleRoute({
        name: 'non-auth',
        children: [
          Route({
            name: 'login',
            path: 'login/',
          }),
          Route({
            name: 'sign-up',
            path: 'sign-up/',
          }),
        ],
      }),
      ModuleRoute({
        name: 'auth',
        children: [
          Route({
            name: 'dashboard',
            path: 'dashboard/',
            children: [
              FallbackRoute({
                name: 'dashboard-404',
              }),
              Route({
                name: 'settings',
                path: 'settings/',
              }),
            ],
          }),
        ],
      }),
    ],
  })

  describe('creation', () => {
    it('created with proper root', () => {
      const router = Router({ root })

      expect(router.root).toBe(root)
    })
  })

  describe('getMap', () => {
    it('shaped correctly', () => {
      const router = Router({})
      const snapshot1 = `[]`

      expect(JSON.stringify(router.getMap(), replacer)).toEqual(snapshot1)

      router.root = root
      const snapshot2 = `[["root",{"route":{"name":"root","path":"/","mounted":false,"children":[{"name":"404","fallback":true,"mounted":false},{"name":"non-auth","mounted":false,"children":[{"name":"login","path":"login/","mounted":false},{"name":"sign-up","path":"sign-up/","mounted":false}]},{"name":"auth","mounted":false,"children":[{"name":"dashboard","path":"dashboard/","mounted":false,"children":[{"name":"dashboard-404","fallback":true,"mounted":false},{"name":"settings","path":"settings/","mounted":false}]}]}]},"children":["root.404","root.non-auth","root.auth"],"fallback":"root.404"}],["root.404",{"route":{"name":"404","fallback":true,"mounted":false},"parent":"root"}],["root.non-auth",{"route":{"name":"non-auth","mounted":false,"children":[{"name":"login","path":"login/","mounted":false},{"name":"sign-up","path":"sign-up/","mounted":false}]},"parent":"root","children":["root.non-auth.login","root.non-auth.sign-up"],"fallback":"root.404"}],["root.non-auth.login",{"route":{"name":"login","path":"login/","mounted":false},"parent":"root.non-auth","fallback":"root.404"}],["root.non-auth.sign-up",{"route":{"name":"sign-up","path":"sign-up/","mounted":false},"parent":"root.non-auth","fallback":"root.404"}],["root.auth",{"route":{"name":"auth","mounted":false,"children":[{"name":"dashboard","path":"dashboard/","mounted":false,"children":[{"name":"dashboard-404","fallback":true,"mounted":false},{"name":"settings","path":"settings/","mounted":false}]}]},"parent":"root","children":["root.auth.dashboard"],"fallback":"root.404"}],["root.auth.dashboard",{"route":{"name":"dashboard","path":"dashboard/","mounted":false,"children":[{"name":"dashboard-404","fallback":true,"mounted":false},{"name":"settings","path":"settings/","mounted":false}]},"parent":"root.auth","children":["root.auth.dashboard.dashboard-404","root.auth.dashboard.settings"],"fallback":"root.auth.dashboard.dashboard-404"}],["root.auth.dashboard.dashboard-404",{"route":{"name":"dashboard-404","fallback":true,"mounted":false},"parent":"root.auth.dashboard"}],["root.auth.dashboard.settings",{"route":{"name":"settings","path":"settings/","mounted":false},"parent":"root.auth.dashboard","fallback":"root.auth.dashboard.dashboard-404"}]]`

      expect(JSON.stringify(router.getMap(), replacer)).toEqual(snapshot2)
      expect(JSON.stringify(router.getMap(), replacer)).toEqual(snapshot2)

      router.root = Route({ name: 'foo', path: 'foo/' })
      const snapshot3 = `[["foo",{"route":{"name":"foo","path":"foo/","mounted":false}}]]`

      expect(JSON.stringify(router.getMap(), replacer)).toEqual(snapshot3)
      expect(JSON.stringify(router.getMap(), replacer)).toEqual(snapshot3)
    })
  })
})
