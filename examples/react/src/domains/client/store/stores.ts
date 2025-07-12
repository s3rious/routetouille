import { type Store, createStore, combine } from "effector";
import { persist } from "effector-storage/local";
import * as effects from "./effects.js";
import { ClientModel } from "./model.js";
import * as api from "./api.js";

const $client = createStore(new ClientModel({}), { name: "client/$client" })
  .on(
    effects.fetchClient.doneData,
    (state, client) => new ClientModel({ ...state, ...client }),
  )
  .on(effects.signUp.doneData, (state, response) => {
    if (response instanceof Error) {
      return state;
    }
    return new ClientModel({ ...state, ...response });
  })
  .reset(effects.logOut.done);

type AccessTokenStoreState = string | null;

const $accessToken: Store<AccessTokenStoreState> =
  createStore<AccessTokenStoreState>(null, {
    name: "client/$accessToken",
  })
    .on(effects.logIn.doneData, (_state, accessToken) => accessToken)
    .on(effects.signUp.doneData, (state, response) => {
      if (response instanceof Error) {
        return state;
      }
      return response.accessToken;
    })
    .reset(effects.logOut.done);

// Attach the logOut effect handler here, since it needs $accessToken
// (Effector allows setting the handler after effect creation)
effects.logOut.use(async () => {
  const accessToken = $accessToken.getState();
  if (accessToken) {
    return await api.revokeAccessToken(accessToken);
  }
  throw new Error();
});

const $isClientLoading = combine(
  Object.values(effects).map((effect) => effect.pending),
  (pendings: boolean[]) => pendings.some(Boolean),
);

persist({
  store: $accessToken,
  key: "CLIENT_ACCESS_TOKEN",
});

export { $client, $accessToken, $isClientLoading };
