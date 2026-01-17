import { createEffect } from "effector";
import * as api from "./api.js";

// Effect to fetch client
const fetchClient = createEffect({
  name: "client/fetchClient",
  async handler({ accessToken }: { accessToken: string }) {
    return await api.fetchClient(accessToken);
  },
});

// Effect to log in
const logIn = createEffect({
  name: "client/logIn",
  async handler({ email, password }: { email: string; password: string }) {
    const { accessToken } = await api.getAccessTokenByEmailPasswordPair(
      email,
      password,
    );
    return accessToken;
  },
});

// Effect to sign up
const signUp = createEffect({
  name: "client/signUp",
  async handler({ email, password }: { email: string; password: string }) {
    return await api.createClient(email, password);
  },
});

// Effect to log out (handler will be set in stores.ts)
const logOut = createEffect({
  name: "client/logOut",
});

export { fetchClient, logIn, signUp, logOut };
