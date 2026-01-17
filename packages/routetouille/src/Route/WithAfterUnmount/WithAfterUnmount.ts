import type {
  MountableOptions,
  MountableInterface,
} from "../Mountable/index.js";

type WithAfterUnmountOptions = {
  afterUnmount?: () => Promise<void>;
};

type WithAfterUnmountInterface = Record<string, unknown>;

function WithAfterUnmount<
  ComposedOptions extends MountableOptions,
  ComposedInterface extends MountableInterface,
>(createRoute?: (options: ComposedOptions) => ComposedInterface) {
  return (
    options: WithAfterUnmountOptions & ComposedOptions,
  ): WithAfterUnmountInterface & ComposedInterface => {
    const composed: ComposedInterface =
      createRoute?.(options) ?? ({} as ComposedInterface);
    const afterUnmount = options.afterUnmount;

    async function unmount(
      this: WithAfterUnmountInterface & ComposedInterface,
    ): Promise<void> {
      const unmount = composed.unmount.bind(this)();

      void unmount.then(() => {
        if (afterUnmount != null) {
          // move to next tick
          setTimeout(() => {
            void afterUnmount();
          }, 0);
        }
      });

      return await unmount;
    }

    return { ...composed, unmount };
  };
}

export {
  WithAfterUnmount,
  type WithAfterUnmountOptions,
  type WithAfterUnmountInterface,
};
