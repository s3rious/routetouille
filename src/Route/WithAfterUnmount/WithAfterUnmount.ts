import { MountableOptions, MountableInterface } from '../Mountable'

type WithAfterUnmountOptions = {
  afterUnmount?: () => Promise<void>
}

type WithAfterUnmountInterface = {}

function WithAfterUnmount<ComposedOptions extends MountableOptions, ComposedInterface extends MountableInterface>(
  createRoute?: (options: ComposedOptions) => ComposedInterface,
) {
  return function (options: WithAfterUnmountOptions & ComposedOptions): WithAfterUnmountInterface & ComposedInterface {
    const composed: ComposedInterface = createRoute?.(options) ?? ({} as ComposedInterface)
    const afterUnmount = options.afterUnmount

    async function unmount(this: WithAfterUnmountInterface & ComposedInterface): Promise<void> {
      const unmount = composed.unmount.bind(this)()

      void unmount.then(() => {
        if (afterUnmount != null) {
          // move to next tick
          setTimeout(() => {
            void afterUnmount()
          }, 0)
        }
      })

      return unmount
    }

    return { ...composed, unmount }
  }
}

export { WithAfterUnmount, WithAfterUnmountOptions, WithAfterUnmountInterface }
