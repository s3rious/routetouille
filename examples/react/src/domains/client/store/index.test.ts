import { createEvent } from 'effector'
import { $client, $accessToken, $isClientLoading } from './index'
import { fetchClient, logIn, signUp, logOut } from './effects'
import { ClientModel } from './model'

describe('client/store/index', function () {
  const accessToken = 'accessToken+john.pass@example.com'
  const email = 'email@example.com'
  const password = 'email@example.com1Q'
  const firstName = 'John'
  const lastName = 'Pass'
  const fullName = `${firstName} ${lastName}`

  beforeEach(function () {
    const reset = createEvent()

    $client.reset(reset)
    $accessToken.reset(reset)

    reset()

    expect($client.getState()).toEqual(new ClientModel({}))
    expect($accessToken.getState()).toEqual(null)
  })

  describe('$client', function () {
    it('initial state', function () {
      expect($client.getState()).toBeInstanceOf(ClientModel)
      expect($client.getState()).toEqual(new ClientModel({}))
    })

    it('`fetchClient` updates store', async function () {
      const defaultHandler = fetchClient.use.getCurrent()

      fetchClient.use(() => ({ email, firstName: null, lastName: null }))
      await fetchClient({ accessToken: 'foo' })
      expect($client.getState()).toBeInstanceOf(ClientModel)
      expect($client.getState()).toEqual({ email, firstName: null, lastName: null, fullName: null })

      fetchClient.use(() => ({ email: null, firstName, lastName }))
      await fetchClient({ accessToken: 'foo' })
      expect($client.getState()).toBeInstanceOf(ClientModel)
      expect($client.getState()).toEqual({ email: null, firstName, lastName, fullName })

      fetchClient.use(defaultHandler)
    })

    it('`signUp` updates store', async function () {
      const defaultHandler = signUp.use.getCurrent()

      signUp.use(() => ({ accessToken, email, firstName, lastName }))
      await signUp({ email, password })
      expect($client.getState()).toBeInstanceOf(ClientModel)
      expect($client.getState()).toEqual({ email, firstName, lastName, fullName })

      signUp.use(defaultHandler)
    })

    it('`signUp` returns previous store state on error', async function () {
      const defaultHandler = signUp.use.getCurrent()
      const alternativeEmail = 'foo@bar.baz'

      signUp.use(() => ({ accessToken, email, firstName, lastName }))
      await signUp({ email, password })
      expect($client.getState()).toEqual({ email, firstName, lastName, fullName })

      signUp.use(() => new Error())
      await signUp({ email: alternativeEmail, password })
      expect($client.getState()).toEqual({ email, firstName, lastName, fullName })

      signUp.use(defaultHandler)
    })

    it('`logOut` resets store', async function () {
      const defaultSignUpHandler = signUp.use.getCurrent()
      const defaultLogOutHandler = logOut.use.getCurrent()

      signUp.use(() => ({ accessToken, email, firstName, lastName }))
      await signUp({ email, password })
      expect($client.getState()).toEqual(new ClientModel({ email, firstName, lastName }))

      logOut.use(() => null)
      await logOut()
      expect($client.getState()).toEqual(new ClientModel({}))

      signUp.use(defaultSignUpHandler)
      logOut.use(defaultLogOutHandler)
    })
  })

  describe('$accessToken', function () {
    it('initial state', function () {
      expect($accessToken.getState()).toEqual(null)
    })

    it('`logIn` updates store', async function () {
      const defaultHandler = logIn.use.getCurrent()

      logIn.use(() => accessToken)
      await logIn({ email, password })
      expect($accessToken.getState()).toEqual(accessToken)

      logIn.use(defaultHandler)
    })

    it('`signUp` updates store', async function () {
      const defaultHandler = signUp.use.getCurrent()

      signUp.use(() => ({ accessToken, email, firstName, lastName }))
      await signUp({ email, password })
      expect($accessToken.getState()).toEqual(accessToken)

      signUp.use(defaultHandler)
    })

    it('`signUp` returns previous store state on error', async function () {
      const defaultHandler = signUp.use.getCurrent()
      const alternativeEmail = 'foo@bar.baz'

      signUp.use(() => ({ accessToken, email, firstName, lastName }))
      await signUp({ email, password })
      expect($accessToken.getState()).toEqual(accessToken)

      signUp.use(() => new Error())
      await signUp({ email: alternativeEmail, password })
      expect($client.getState()).toEqual({ email, firstName, lastName, fullName })

      signUp.use(defaultHandler)
    })

    it('`logOut` resets store', async function () {
      const defaultSignUpHandler = signUp.use.getCurrent()
      const defaultLogOutHandler = logOut.use.getCurrent()

      signUp.use(() => ({ accessToken, email, firstName, lastName }))
      await signUp({ email, password })
      expect($accessToken.getState()).toEqual(accessToken)

      logOut.use(() => null)
      await logOut()
      expect($accessToken.getState()).toEqual(null)

      signUp.use(defaultSignUpHandler)
      logOut.use(defaultLogOutHandler)
    })
  })

  describe('$isClientLoading', function () {
    it('initial state', function () {
      expect($isClientLoading.getState()).toEqual(false)
    })

    it('when `fetchClient` is pending returns true', async function () {
      fetchClient.use(async () => await new Promise((resolve) => resolve({ email, firstName: null, lastName: null })))
      const fetch = fetchClient({ accessToken })
      expect($isClientLoading.getState()).toEqual(true)
      await fetch
      expect($isClientLoading.getState()).toEqual(false)
    })

    it('when `logIn` is pending returns true', async function () {
      logIn.use(async () => await new Promise((resolve) => resolve(accessToken)))
      const fetch = logIn({ email, password })
      expect($isClientLoading.getState()).toEqual(true)
      await fetch
      expect($isClientLoading.getState()).toEqual(false)
    })

    it('when `signUp` is pending returns true', async function () {
      signUp.use(async () => await new Promise((resolve) => resolve({ accessToken, email, firstName, lastName })))
      const fetch = signUp({ email, password })
      expect($isClientLoading.getState()).toEqual(true)
      await fetch
      expect($isClientLoading.getState()).toEqual(false)
    })

    it('when `logOut` is pending returns true', async function () {
      logOut.use(async () => await new Promise((resolve) => resolve(null)))
      const fetch = logOut()
      expect($isClientLoading.getState()).toEqual(true)
      await fetch
      expect($isClientLoading.getState()).toEqual(false)
    })
  })
})
