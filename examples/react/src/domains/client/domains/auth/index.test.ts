import { Router, Route } from 'services/router'

import { getRoute } from './index'
import { $client, $accessToken, effects } from 'domains/client'

jest.mock('domains/client')

const router = Router({})
const authChildren1Route = Route({
  name: 'children1',
  path: 'children1/',
})
const authChildren2Route = Route({
  name: 'children2',
  path: 'children2/',
})
const authRoute = getRoute(router, [authChildren1Route, authChildren2Route])
const nonAuthRoute = Route({
  name: 'non-auth',
  path: 'non-auth/',
})
const rootRoute = Route({
  name: 'root',
  path: '/',
  children: [authRoute, nonAuthRoute],
})
router.root = rootRoute

async function wait(timeout = 1) {
  return await new Promise(function (resolve) {
    setTimeout(resolve, timeout)
  })
}

describe('when `accessToken` is not set', function () {
  beforeAll(async function () {
    router.active = []
    jest.clearAllMocks()

    // @ts-expect-error
    $accessToken.getState.mockImplementation(() => null)

    await router.goTo('auth')
  })

  afterEach(async function () {
    await wait()
  })

  it('should redirect to `non-auth`', function () {
    expect(router.active[router.active.length - 1].name).toEqual('non-auth')
  })

  it('`fetchClient` should not have been called', function () {
    expect(effects.fetchClient).not.toHaveBeenCalled()
  })
})

describe('when `accessToken` is set', function () {
  describe('when `client` is not fetched', function () {
    beforeAll(async function () {
      router.active = []
      jest.clearAllMocks()

      // @ts-expect-error
      $accessToken.getState.mockImplementation(() => '123')
      // @ts-expect-error
      $client.getState.mockImplementation(() => ({ isFetched: () => false }))

      await router.goTo('auth')
    })

    afterEach(async function () {
      await wait()
    })

    it('should redirect to first children of `auth`', async function () {
      expect(router.active[router.active.length - 1].name).toEqual('children1')
    })

    it('`fetchClient` should have been called with `accessToken`', function () {
      expect(effects.fetchClient).toHaveBeenCalled()
      expect(effects.fetchClient).toHaveBeenCalledWith({ accessToken: '123' })
    })
  })

  describe('when `client` is fetched', function () {
    beforeAll(async function () {
      router.active = []
      jest.clearAllMocks()

      // @ts-expect-error
      $accessToken.getState.mockImplementation(() => '123')
      // @ts-expect-error
      $client.getState.mockImplementation(() => ({ isFetched: () => true }))

      await router.goTo('auth')
    })

    afterEach(async function () {
      await wait()
    })

    it('should redirect to first children of `auth`', async function () {
      expect(router.active[router.active.length - 1].name).toEqual('children1')
    })

    it('`fetchClient` should not have been called', function () {
      expect(effects.fetchClient).not.toHaveBeenCalled()
    })
  })
})
