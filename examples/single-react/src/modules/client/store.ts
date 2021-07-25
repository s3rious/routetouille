import { createStore, createEffect, combine } from 'effector'
import { persist } from 'effector-storage/local'

type ClientLoginParams = {
  email: string
  password: string
}

const logOutFx = createEffect({
  name: 'log in client by email and password',
  async handler() {
    return await new Promise((resolve, _reject) => {
      setTimeout(() => {
        resolve('')
      }, 1000)
    })
  },
})

const logInFx = createEffect<ClientLoginParams, string>({
  name: 'log in client by email and password',
  async handler({ email, password }) {
    return await new Promise((resolve, _reject) => {
      setTimeout(() => {
        resolve(`token+${email}+${password}`)
      }, 1000)
    })
  },
})

const effects = {
  logInFx,
  logOutFx,
}

type ClientStoreState = {
  accessToken: string | null
  email: string | null
}

const client = createStore<Omit<ClientStoreState, 'accessToken'>>({
  email: null,
}).reset(logOutFx)

const token = createStore<Pick<ClientStoreState, 'accessToken'>>({
  accessToken: null,
})
  .reset(logOutFx)
  .on(logInFx.doneData, (state, token) => ({ accessToken: token }))

persist({
  store: token,
  key: 'CLIENT_TOKEN',
})

const store = combine(
  client,
  token,
  (client: Omit<ClientStoreState, 'accessToken'>, token: Pick<ClientStoreState, 'accessToken'>) => ({
    ...client,
    ...token,
  }),
)

export { effects, store, ClientStoreState }
