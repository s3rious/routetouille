import { MountableOptions, MountableInterface } from '../Mountable'

type WithBeforeUnmountOptions = {
  beforeUnmount?: () => Promise<void>
}

type WithBeforeUnmountInterface = {}

function WithBeforeUnmount<ComposedOptions extends MountableOptions, ComposedInterface extends MountableInterface>(
  createRoute?: (options: ComposedOptions) => ComposedInterface,
) {
  return function (
    options: WithBeforeUnmountOptions & ComposedOptions,
  ): WithBeforeUnmountInterface & ComposedInterface {
    const composed: ComposedInterface = createRoute?.(options) ?? ({} as ComposedInterface)
    const beforeUnmount = options.beforeUnmount

    async function unmount(this: WithBeforeUnmountInterface & ComposedInterface): Promise<void> {
      if (beforeUnmount != null) {
        await beforeUnmount()
      }

      return await composed.unmount.bind(this)()
    }

    return { ...composed, unmount }
  }
}

export { WithBeforeUnmount, WithBeforeUnmountOptions, WithBeforeUnmountInterface }
