import { GET, POST } from 'services/api'
import { fetchClient, logIn, logOut, signUp } from './effects'
import { $accessToken } from './index'

jest.mock('services/api')
jest.mock('./index')

describe('client/store/effects', function () {
  const accessToken: string = 'accessToken+john.pass@example.com+john.pass@example.com1Q'
  const email: string = 'john.pass@example.com'
  const password: string = 'john.pass@example.com1Q'
  const firstName: string = 'john'
  const lastName: string = 'pass'

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('fetchClient', function () {
    it('calls an api', async function () {
      // @ts-expect-error
      GET.mockResolvedValueOnce({ email, firstName, lastName })

      const client = await fetchClient({ accessToken })

      expect(GET).toHaveBeenCalledTimes(1)
      expect(GET).toHaveBeenLastCalledWith('client/', { accessToken }, { email, firstName, lastName })
      expect(client).toEqual({ email, firstName, lastName })
    })
  })

  describe('logIn', function () {
    it('calls an api', async function () {
      // @ts-expect-error
      POST.mockResolvedValueOnce({ accessToken })

      const accessTokenAfterLogin = await logIn({ email, password })

      expect(POST).toHaveBeenCalledTimes(1)
      expect(POST).toHaveBeenLastCalledWith('oauth/token', { email, password }, { accessToken })
      expect(accessTokenAfterLogin).toEqual(accessToken)
    })
  })

  describe('signUp', function () {
    it('calls an api', async function () {
      // @ts-expect-error
      POST.mockResolvedValueOnce({ accessToken, email, firstName, lastName })

      const clientWithAccessToken = await signUp({ email, password })

      expect(POST).toHaveBeenCalledTimes(1)
      expect(POST).toHaveBeenLastCalledWith('client', { email, password }, { accessToken, email, firstName, lastName })
      expect(clientWithAccessToken).toEqual({ accessToken, email, firstName, lastName })
    })

    it('raises an error if client is not from `example.com`', async function () {
      const anotherEmail: string = `john.pass@foobar.com`
      const error: Error = new Error('Only clients with emails at ‘example.com’ can sign up')
      // @ts-expect-error
      POST.mockResolvedValueOnce(error)

      const clientWithAccessToken = await signUp({ email: anotherEmail, password })

      expect(POST).toHaveBeenCalledTimes(1)
      expect(POST).toHaveBeenLastCalledWith('client', { email: anotherEmail, password }, error)
      expect(clientWithAccessToken).toEqual(error)
    })
  })

  describe('logOut', function () {
    it('calls an api', async function () {
      // @ts-expect-error
      $accessToken.getState.mockReturnValue(accessToken)
      // @ts-expect-error
      POST.mockResolvedValueOnce(null)

      await logOut()

      expect(POST).toHaveBeenCalledTimes(1)
      expect(POST).toHaveBeenLastCalledWith('oauth/revoke-token', { accessToken }, null)
    })

    it('raises an error if there is no `accessToken`', async function () {
      // @ts-expect-error
      $accessToken.getState.mockReturnValue(null)
      // @ts-expect-error
      POST.mockResolvedValueOnce(null)

      try {
        await logOut()
      } catch (error) {
        expect(POST).toHaveBeenCalledTimes(0)
        expect(error).toBeInstanceOf(Error)
      }
    })
  })
})
