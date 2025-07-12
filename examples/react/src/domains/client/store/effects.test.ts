import { fork, allSettled } from "effector";
import { describe, it, expect, vi } from "vitest";
import { fetchClient, logIn, logOut, signUp } from "./effects.js";
import { $client, $accessToken } from "./stores.js";
import { ClientModel } from "./model.js";

vi.mock("./api", () => ({
  fetchClient: vi.fn().mockResolvedValue({
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
  }),
  getAccessTokenByEmailPasswordPair: vi
    .fn()
    .mockResolvedValue({ accessToken: "accessToken+a+b" }),
  createClient: vi.fn().mockResolvedValue({
    email: "x@example.com",
    firstName: "X",
    lastName: "Y",
  }),
  revokeAccessToken: vi.fn().mockResolvedValue(null),
}));

describe("effects", () => {
  it("fetchClient updates $client", async () => {
    const scope = fork();
    await allSettled(fetchClient, { scope, params: { accessToken: "token" } });
    expect(scope.getState($client)).toEqual(
      new ClientModel({
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
      }),
    );
  });
  it("logIn updates $accessToken", async () => {
    const scope = fork();
    await allSettled(logIn, { scope, params: { email: "a", password: "b" } });
    expect(scope.getState($accessToken)).toBe("accessToken+a+b");
  });
  it("logOut clears $accessToken", async () => {
    // @ts-expect-error Effector typing issue
    const scope = fork({ values: [[$accessToken, "token"]] });
    // @ts-expect-error Effector typing issue
    await allSettled(logOut, { scope });
    expect(scope.getState($accessToken)).toBe(null);
  });
  it("signUp updates $client", async () => {
    const scope = fork();
    await allSettled(signUp, {
      scope,
      params: { email: "x@example.com", password: "y" },
    });
    expect(scope.getState($client)).toEqual(
      new ClientModel({
        email: "x@example.com",
        firstName: "X",
        lastName: "Y",
      }),
    );
  });
});
