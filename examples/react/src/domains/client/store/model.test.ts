import { describe, expect, it } from "vitest";
import { ClientModel } from "./model.js";

describe("client/store/model", () => {
  describe("constructor", () => {
    it("creates with nulls if nothing was passed", () => {
      expect(new ClientModel({})).toEqual({
        email: null,
        firstName: null,
        lastName: null,
        fullName: null,
      });
    });

    it("takes only valid email addresses", () => {
      expect(new ClientModel({ email: "foo" })).toEqual({
        email: null,
        firstName: null,
        lastName: null,
        fullName: null,
      });

      expect(new ClientModel({ email: "foo@bar" })).toEqual({
        email: "foo@bar",
        firstName: null,
        lastName: null,
        fullName: null,
      });
    });

    it("capitalizes names and joins full name", () => {
      expect(new ClientModel({ firstName: "foo", lastName: "BAR" })).toEqual({
        email: null,
        firstName: "Foo",
        lastName: "Bar",
        fullName: "Foo Bar",
      });
    });
  });

  describe("isFetched", () => {
    it("returns false if there is no email", () => {
      expect(new ClientModel({}).isFetched()).toBe(false);
    });

    it("returns true if there is an email", () => {
      expect(new ClientModel({ email: "foo@bar" }).isFetched()).toBe(true);
    });
  });
});
