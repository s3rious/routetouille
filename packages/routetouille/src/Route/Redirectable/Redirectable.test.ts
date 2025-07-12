import { describe, it, expect, vi } from "vitest";
import { Redirectable } from "./Redirectable.js";
import {
  Mountable,
  type MountableInterface,
  type MountableOptions,
} from "../Mountable/index.js";

import { omitFunctions } from "../_tests-shared/index.js";

describe("`Redirectable` route", () => {
  const Route = Redirectable<MountableOptions, MountableInterface>(Mountable());

  describe("extends `Mountable`", () => {
    it("extends", () => {
      const mounted = false;
      const expected = { mounted };

      const route = Route({ redirects: [] });

      expect(omitFunctions(route)).toEqual(expected);
    });
  });

  describe("methods", () => {
    describe("mount (without redirects)", () => {
      const route = Route({});

      it("mounts", async () => {
        expect(route.mounted).toBe(false);
        await route.mount();
        expect(route.mounted).toBe(true);
      });
    });

    describe("mount (with redirects)", () => {
      it("mounts", async () => {
        const firstShouldWe = vi.fn().mockImplementation(() => false);
        const firstWhatTo = vi.fn();
        const secondShouldWe = vi.fn().mockImplementation(() => false);
        const secondWhatTo = vi.fn();
        const thirdShouldWe = vi.fn().mockImplementation(() => false);
        const thirdWhatTo = vi.fn();

        const route = Route({
          redirects: [
            [async () => firstShouldWe(), async () => firstWhatTo()],
            [async () => secondShouldWe(), async () => secondWhatTo()],
            [async () => thirdShouldWe(), async () => thirdWhatTo()],
          ],
        });

        expect(route.mounted).toBe(false);
        await route.mount();

        expect(firstShouldWe).toBeCalledTimes(1);
        expect(firstWhatTo).toBeCalledTimes(0);
        expect(secondShouldWe).toBeCalledTimes(1);
        expect(secondWhatTo).toBeCalledTimes(0);
        expect(thirdShouldWe).toBeCalledTimes(1);
        expect(thirdWhatTo).toBeCalledTimes(0);
        expect(route.mounted).toBe(true);
      });

      it("redirected", async () => {
        const firstShouldWe = vi.fn().mockImplementation(() => false);
        const firstWhatTo = vi.fn();
        const secondShouldWe = vi.fn().mockImplementation(() => true);
        const secondWhatTo = vi.fn();
        const thirdShouldWe = vi.fn().mockImplementation(() => true);
        const thirdWhatTo = vi.fn();

        const route = Route({
          redirects: [
            [async () => firstShouldWe(), async () => firstWhatTo()],
            [async () => secondShouldWe(), async () => secondWhatTo()],
            [async () => thirdShouldWe(), async () => thirdWhatTo()],
          ],
        });

        expect(route.mounted).toBe(false);

        await route.mount();

        expect(firstShouldWe).toBeCalledTimes(1);
        expect(firstWhatTo).toBeCalledTimes(0);
        expect(secondShouldWe).toBeCalledTimes(1);
        expect(secondWhatTo).toBeCalledTimes(1);
        expect(thirdShouldWe).toBeCalledTimes(0);
        expect(thirdWhatTo).toBeCalledTimes(0);
        expect(route.mounted).toBe(false);
      });
    });
  });
});
