import { MountableOptions, MountableInterface } from '../Mountable'

type WithAfterMountOptions = {
  afterMount?: () => Promise<void>
}

type WithAfterMountInterface = {}

function WithAfterMount<ComposedOptions extends MountableOptions, ComposedInterface extends MountableInterface>(
  createRoute?: (options: ComposedOptions) => ComposedInterface,
) {
  return function (options: WithAfterMountOptions & ComposedOptions): WithAfterMountInterface & ComposedInterface {
    const composed: ComposedInterface = createRoute?.(options) ?? ({} as ComposedInterface)
    const afterMount = options.afterMount

    async function mount(this: WithAfterMountInterface & ComposedInterface): Promise<void> {
      const mount = composed.mount.bind(this)()

      void mount.then(() => {
        if (afterMount != null) {
          // move to next tick
          setTimeout(() => {
            if (this.mounted) {
              void afterMount()
            }
          }, 0)
        }
      })

      return mount
    }

    return { ...composed, mount }
  }
}

export { WithAfterMount, WithAfterMountOptions, WithAfterMountInterface }
