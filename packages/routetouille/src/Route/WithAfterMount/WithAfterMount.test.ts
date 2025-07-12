import { describe, it, expect, vi } from "vitest";
import { WithAfterMount } from "./WithAfterMount.js";
import {
  Mountable,
  type MountableInterface,
  type MountableOptions,
} from "../Mountable/index.js";

import { omitFunctions } from "../_tests-shared/index.js";

describe("`WithAfterMount` route", () => {
  const Route = WithAfterMount<MountableOptions, MountableInterface>(
    Mountable(),
  );

  describe("extends `Mountable`", () => {
    it("extends", () => {
      const mounted = false;
      const expected = { mounted };

      const route = Route({});

      expect(omitFunctions(route)).toEqual(expected);
    });
  });

  describe("methods", () => {
    describe("mount (without after)", () => {
      const route = Route({});

      it("mounts", async () => {
        expect(route.mounted).toBe(false);
        await route.mount();
        expect(route.mounted).toBe(true);
      });
    });

    describe("mount (with redirects)", () => {
      it("calls `afterMount` after mount", async () => {
        vi.useFakeTimers();

        const afterMountCallback = vi.fn();
        const afterMount = vi.fn().mockImplementation(
          async () =>
            await new Promise((resolve) => {
              setTimeout(() => {
                afterMountCallback();
                resolve(null);
              }, 1000);
            }),
        );

        const route = Route({ afterMount });

        expect(route.mounted).toBe(false);
        expect(afterMount).toBeCalledTimes(0);
        await route.mount();
        expect(route.mounted).toBe(true);
        expect(afterMount).toBeCalledTimes(0);
        expect(afterMountCallback).toBeCalledTimes(0);

        vi.runAllTimers();

        expect(afterMount).toBeCalledTimes(1);
        expect(afterMountCallback).toBeCalledTimes(1);
      });

      it("error in `afterMount` does not interfere with mount", async () => {
        vi.useFakeTimers();
        const afterMountErrorHandle = vi.fn();
        const afterMount = vi.fn().mockImplementation(
          async () =>
            await new Promise((_resolve, reject) => {
              setTimeout(() => {
                reject(new Error("error"));
              }, 1000);
            }).then(
              () => {},
              async () => {
                afterMountErrorHandle();
              },
            ),
        );

        const route = Route({ afterMount });

        expect(route.mounted).toBe(false);
        expect(afterMount).toBeCalledTimes(0);
        await route.mount();
        expect(route.mounted).toBe(true);
        expect(afterMount).toBeCalledTimes(0);
        expect(afterMountErrorHandle).toBeCalledTimes(0);

        await vi.runAllTimers();

        expect(afterMount).toBeCalledTimes(1);
        expect(afterMountErrorHandle).toBeCalledTimes(1);
      });
    });
  });
});
