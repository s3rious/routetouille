// import { createEffect } from 'effector'
import { createEffect } from 'effector-logger'
import * as api from './api'
import { $accessToken } from './index'

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

export { fetchClient, logIn, logOut }
