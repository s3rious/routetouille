import { Store } from 'effector'
// import { createStore, combine } from 'effector'
import { createStore, combine } from 'effector-logger'
import { persist } from 'effector-storage/local'

import { ClientModel } from './model'
import * as effects from './effects'

const $client = createStore(new ClientModel({}), { name: 'client/$client' })
  .on(effects.fetchClient.doneData, (state, client) => new ClientModel({ ...state, ...client }))
  .reset(effects.logOut.done)

type AccessTokenStoreState = string | null

const $accessToken: Store<AccessTokenStoreState> = createStore<AccessTokenStoreState>(null, {
  name: 'client/$accessToken',
})
  .on(effects.logIn.doneData, (state, accessToken) => accessToken)
  .reset(effects.logOut.done)

const $isClientLoading: Store<boolean> = combine(
  // @ts-expect-error feels like effector’s typing error
  ...Object.values(effects).map((effect) => effect.pending),
  (...pendings: boolean[]) => pendings.some((pending) => pending),
)

persist({
  store: $accessToken,
  key: 'CLIENT_ACCESS_TOKEN',
})

export { $client, $accessToken, $isClientLoading, effects }
