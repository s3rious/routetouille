import { fork, allSettled } from "effector";
import { describe, it, expect } from "vitest";
import { fetchClient, logIn, logOut, signUp } from "./effects.js";
import { $accessToken, $client, $isClientLoading } from "./index.js";
import { ClientModel } from "./model.js";

describe("client/store/index (scope-based)", () => {
  const accessToken = "accessToken+john.pass@example.com";
  const email = "email@example.com";
  const password = "email@example.com1Q";
  const firstName = "John";
  const lastName = "Pass";
  const fullName = `${firstName} ${lastName}`;

  function createScopeWithHandlers(handlers = []) {
    return fork({ handlers });
  }

  it("$client initial state", () => {
    const scope = fork();
    expect(scope.getState($client)).toBeInstanceOf(ClientModel);
    expect(scope.getState($client)).toEqual(new ClientModel({}));
  });

  it("$client updates on fetchClient.doneData", async () => {
    let resolvePromise: (value: {
      email: string;
      firstName: null;
      lastName: null;
    }) => void;
    const handler = async () =>
      await new Promise<{ email: string; firstName: null; lastName: null }>(
        (resolve) => {
          resolvePromise = resolve;
        },
      );
    // Use the handler that sets resolvePromise
    // @ts-ignore Effector typing issue
    const scope = createScopeWithHandlers([[fetchClient, handler]]);
    // Start the effect, then resolve the promise
    // @ts-ignore Effector typing issue
    const promise = allSettled(fetchClient, {
      scope,
      params: { accessToken: "foo" },
    });
    expect(scope.getState($isClientLoading)).toEqual(true);
    // @ts-ignore Effector typing issue
    resolvePromise({ email, firstName: null, lastName: null });
    await promise;
    expect(scope.getState($client)).toEqual({
      email,
      firstName: null,
      lastName: null,
      fullName: null,
    });
  });

  it("$client updates on signUp.doneData", async () => {
    const scope = createScopeWithHandlers([
      [signUp, async () => ({ accessToken, email, firstName, lastName })],
    ]);
    await allSettled(signUp, { scope, params: { email, password } });
    expect(scope.getState($client)).toEqual({
      email,
      firstName,
      lastName,
      fullName,
    });
  });

  it("$client does not update on signUp error", async () => {
    // @ts-ignore Effector typing issue
    const scope = createScopeWithHandlers([[signUp, async () => new Error()]]);
    await allSettled(signUp, { scope, params: { email, password } });
    expect(scope.getState($client)).toEqual(new ClientModel({}));
  });

  it("$client resets on logOut", async () => {
    const scope = createScopeWithHandlers([
      [signUp, async () => ({ accessToken, email, firstName, lastName })],
      [logOut, async () => null],
    ]);
    await allSettled(signUp, { scope, params: { email, password } });
    expect(scope.getState($client)).toEqual({
      email,
      firstName,
      lastName,
      fullName,
    });
    await allSettled(logOut, { scope });
    expect(scope.getState($client)).toEqual(new ClientModel({}));
  });

  it("$accessToken initial state", () => {
    const scope = fork();
    expect(scope.getState($accessToken)).toEqual(null);
  });

  it("$accessToken updates on logIn.doneData", async () => {
    // @ts-ignore Effector typing issue
    const scope = createScopeWithHandlers([[logIn, async () => accessToken]]);
    await allSettled(logIn, { scope, params: { email, password } });
    expect(scope.getState($accessToken)).toEqual(accessToken);
  });

  it("$accessToken updates on signUp.doneData", async () => {
    const scope = createScopeWithHandlers([
      [signUp, async () => ({ accessToken, email, firstName, lastName })],
    ]);
    await allSettled(signUp, { scope, params: { email, password } });
    expect(scope.getState($accessToken)).toEqual(accessToken);
  });

  it("$accessToken does not update on signUp error", async () => {
    // @ts-ignore Effector typing issue
    const scope = createScopeWithHandlers([[signUp, async () => new Error()]]);
    await allSettled(signUp, { scope, params: { email, password } });
    expect(scope.getState($accessToken)).toEqual(null);
  });

  it("$accessToken resets on logOut", async () => {
    const scope = createScopeWithHandlers([
      [signUp, async () => ({ accessToken, email, firstName, lastName })],
      [logOut, async () => null],
    ]);
    await allSettled(signUp, { scope, params: { email, password } });
    expect(scope.getState($accessToken)).toEqual(accessToken);
    await allSettled(logOut, { scope });
    expect(scope.getState($accessToken)).toEqual(null);
  });

  it("$isClientLoading initial state", () => {
    const scope = fork();
    expect(scope.getState($isClientLoading)).toEqual(false);
  });

  it("$isClientLoading is true when fetchClient is pending", async () => {
    let resolvePromise: (value: {
      email: string;
      firstName: null;
      lastName: null;
    }) => void;
    const handler = async () =>
      await new Promise<{ email: string; firstName: null; lastName: null }>(
        (resolve) => {
          resolvePromise = resolve;
        },
      );
    // @ts-ignore Effector typing issue
    const scope = createScopeWithHandlers([[fetchClient, handler]]);
    // @ts-ignore Effector typing issue
    const promise = allSettled(fetchClient, { scope, params: { accessToken } });
    expect(scope.getState($isClientLoading)).toEqual(true);
    // @ts-ignore Effector typing issue
    resolvePromise({ email, firstName: null, lastName: null });
    await promise;
    expect(scope.getState($isClientLoading)).toEqual(false);
  });

  it("$isClientLoading is true when logIn is pending", async () => {
    let resolvePromise: (value: string) => void;
    const handler = async () =>
      await new Promise<string>((resolve) => {
        resolvePromise = resolve;
      });
    // @ts-ignore Effector typing issue
    const scope = createScopeWithHandlers([[logIn, handler]]);
    // @ts-ignore Effector typing issue
    const promise = allSettled(logIn, { scope, params: { email, password } });
    expect(scope.getState($isClientLoading)).toEqual(true);
    // @ts-ignore Effector typing issue
    resolvePromise(accessToken);
    await promise;
    expect(scope.getState($isClientLoading)).toEqual(false);
  });

  it("$isClientLoading is true when signUp is pending", async () => {
    let resolvePromise: (value: {
      accessToken: string;
      email: string;
      firstName: string;
      lastName: string;
    }) => void;
    const handler = async () =>
      await new Promise<{
        accessToken: string;
        email: string;
        firstName: string;
        lastName: string;
      }>((resolve) => {
        resolvePromise = resolve;
      });
    // @ts-ignore Effector typing issue
    const scope = createScopeWithHandlers([[signUp, handler]]);
    // @ts-ignore Effector typing issue
    const promise = allSettled(signUp, { scope, params: { email, password } });
    expect(scope.getState($isClientLoading)).toEqual(true);
    // @ts-ignore Effector typing issue
    resolvePromise({ accessToken, email, firstName, lastName });
    await promise;
    expect(scope.getState($isClientLoading)).toEqual(false);
  });

  it("$isClientLoading is true when logOut is pending", async () => {
    let resolvePromise: (value: null) => void;
    const handler = async () =>
      await new Promise<null>((resolve) => {
        resolvePromise = resolve;
      });
    // @ts-ignore Effector typing issue
    const scope = createScopeWithHandlers([[logOut, handler]]);
    // @ts-ignore Effector typing issue
    const promise = allSettled(logOut, { scope });
    expect(scope.getState($isClientLoading)).toEqual(true);
    // @ts-ignore Effector typing issue
    resolvePromise(null);
    await promise;
    expect(scope.getState($isClientLoading)).toEqual(false);
  });
});
