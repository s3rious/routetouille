import type {
  MountableOptions,
  MountableInterface,
} from "../Mountable/index.js";

type WithBeforeUnmountOptions = {
  beforeUnmount?: () => Promise<void>;
};

type WithBeforeUnmountInterface = Record<string, unknown>;

function WithBeforeUnmount<
  ComposedOptions extends MountableOptions,
  ComposedInterface extends MountableInterface,
>(createRoute?: (options: ComposedOptions) => ComposedInterface) {
  return (
    options: WithBeforeUnmountOptions & ComposedOptions,
  ): WithBeforeUnmountInterface & ComposedInterface => {
    const composed: ComposedInterface =
      createRoute?.(options) ?? ({} as ComposedInterface);
    const beforeUnmount = options.beforeUnmount;

    async function unmount(
      this: WithBeforeUnmountInterface & ComposedInterface,
    ): Promise<void> {
      if (beforeUnmount != null) {
        await beforeUnmount();
      }

      return await composed.unmount.bind(this)();
    }

    return { ...composed, unmount };
  };
}

export {
  WithBeforeUnmount,
  type WithBeforeUnmountOptions,
  type WithBeforeUnmountInterface,
};
