import { createEffect } from 'effector'

import { $accessToken } from './index'
import * as api from './api'

type FetchClientParams = {
  accessToken: string
}

const fetchClient = createEffect({
  name: 'client/fetchClient',
  async handler({ accessToken }: FetchClientParams) {
    return await api.fetchClient(accessToken)
  },
})

type LogInParams = {
  email: string
  password: string
}

const logIn = createEffect({
  name: 'client/logIn',
  async handler({ email, password }: LogInParams) {
    const { accessToken } = await api.getAccessTokenByEmailPasswordPair(email, password)

    return accessToken
  },
})

type SignUpParams = {
  email: string
  password: string
}

const signUp = createEffect({
  name: 'client/signUp',
  async handler({ email, password }: SignUpParams) {
    return await api.createClient(email, password)
  },
})

const logOut = createEffect({
  name: 'client/logOut',
  async handler() {
    const accessToken = $accessToken.getState()

    if (accessToken) {
      return await api.revokeAccessToken(accessToken)
    }

    throw new Error()
  },
})

export { fetchClient, logIn, signUp, logOut }
