import { describe, it, expect, vi } from "vitest";
import { WithAfterUnmount } from "./WithAfterUnmount.js";
import {
  Mountable,
  type MountableInterface,
  type MountableOptions,
} from "../Mountable/index.js";

describe("`WithAfterUnmount` route", () => {
  const Route = WithAfterUnmount<MountableOptions, MountableInterface>(
    Mountable(),
  );

  describe("extends `Mountable`", () => {
    it("extends", () => {
      const mounted = false;
      const expected = { mounted };

      const route = Route({});

      expect(JSON.stringify(route)).toEqual(JSON.stringify(expected));
    });
  });

  describe("methods", () => {
    describe("`unmount` (without `afterUnmount`)", () => {
      const route = Route({});

      it("mounts", async () => {
        await route.unmount();
        expect(route.mounted).toBe(false);
      });
    });

    describe("`unmount` (with `afterUnmount`)", () => {
      it("calls `afterUnmount` after `unmount`", async () => {
        vi.useFakeTimers();

        const afterUnmountCallback = vi.fn();
        const afterUnmount = vi.fn().mockImplementation(
          async () =>
            await new Promise((resolve) => {
              setTimeout(() => {
                afterUnmountCallback();
                resolve(null);
              }, 1000);
            }),
        );

        const route = Route({ afterUnmount });

        expect(afterUnmount).toBeCalledTimes(0);
        await route.unmount();
        expect(route.mounted).toBe(false);
        expect(afterUnmount).toBeCalledTimes(0);
        expect(afterUnmountCallback).toBeCalledTimes(0);

        vi.runAllTimers();

        expect(afterUnmount).toBeCalledTimes(1);
        expect(afterUnmountCallback).toBeCalledTimes(1);
      });

      it("error in `afterUnmount` does not interfere with mount", async () => {
        vi.useFakeTimers();

        const afterUnmountErrorHandle = vi.fn();
        const afterUnmount = vi.fn().mockImplementation(
          async () =>
            await new Promise((_resolve, reject) => {
              setTimeout(() => {
                reject(new Error("error"));
              }, 1000);
            }).then(
              () => {},
              async () => {
                afterUnmountErrorHandle();
              },
            ),
        );

        const route = Route({ afterUnmount });

        await route.mount();
        expect(route.mounted).toBe(true);
        expect(afterUnmount).toBeCalledTimes(0);
        await route.unmount();
        expect(route.mounted).toBe(false);
        expect(afterUnmount).toBeCalledTimes(0);
        expect(afterUnmountErrorHandle).toBeCalledTimes(0);

        await vi.runAllTimers();

        expect(afterUnmount).toBeCalledTimes(1);
        expect(afterUnmountErrorHandle).toBeCalledTimes(1);
      });
    });
  });
});
