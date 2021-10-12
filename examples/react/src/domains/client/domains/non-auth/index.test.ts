import { Router, Route } from 'services/router'

import { getRoute } from './index'
import { $accessToken } from 'domains/client'

jest.mock('domains/client')

const router = Router({})
const nonAuthChildren1Route = Route({
  name: 'children1',
  path: 'children1/',
})
const nonAuthChildren2Route = Route({
  name: 'children2',
  path: 'children2/',
})
const nonAuthRoute = getRoute(router, [nonAuthChildren1Route, nonAuthChildren2Route])
const authRoute = Route({
  name: 'auth',
  path: 'auth/',
})
const rootRoute = Route({
  name: 'root',
  path: '/',
  children: [nonAuthRoute, authRoute],
})
router.root = rootRoute

async function wait(timeout = 1): Promise<void> {
  return await new Promise(function (resolve) {
    setTimeout(resolve, timeout)
  })
}

describe('when `accessToken` is set', function () {
  beforeAll(async function () {
    router.active = []
    jest.clearAllMocks()

    // @ts-expect-error
    $accessToken.getState.mockImplementation(() => '123')

    await router.goTo('non-auth')
  })

  afterEach(async function () {
    await wait()
  })

  it('should redirect to `auth`', function () {
    expect(router.active[router.active.length - 1].name).toEqual('auth')
  })
})

describe('when `accessToken` is not set', function () {
  beforeAll(async function () {
    router.active = []
    jest.clearAllMocks()

    // @ts-expect-error
    $accessToken.getState.mockImplementation(() => null)

    await router.goTo('non-auth')
  })

  afterEach(async function () {
    await wait()
  })

  it('should redirect to first children of `non-auth`', async function () {
    expect(router.active[router.active.length - 1].name).toEqual('children1')
  })
})
