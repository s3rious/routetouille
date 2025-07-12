import type {
  MountableOptions,
  MountableInterface,
} from "../Mountable/index.js";

type WithBeforeMountOptions = {
  beforeMount?: () => Promise<void>;
};

type WithBeforeMountInterface = Record<string, unknown>;

function WithBeforeMount<
  ComposedOptions extends MountableOptions,
  ComposedInterface extends MountableInterface,
>(createRoute?: (options: ComposedOptions) => ComposedInterface) {
  return (
    options: WithBeforeMountOptions & ComposedOptions,
  ): WithBeforeMountInterface & ComposedInterface => {
    const composed: ComposedInterface =
      createRoute?.(options) ?? ({} as ComposedInterface);
    const beforeMount = options.beforeMount;

    async function mount(
      this: WithBeforeMountInterface & ComposedInterface,
    ): Promise<void> {
      if (beforeMount != null) {
        await beforeMount();
      }

      return await composed.mount.bind(this)();
    }

    return { ...composed, mount };
  };
}

export {
  WithBeforeMount,
  type WithBeforeMountOptions,
  type WithBeforeMountInterface,
};
