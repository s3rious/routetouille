type MountableOptions = {}

type MountableInterface = MountableOptions & {
  mounted: boolean
  mount: () => Promise<void>
  unmount: () => Promise<void>
}

function Mountable<ComposedOptions extends {}, ComposedInterface extends {}>(
  createRoute?: (options: ComposedOptions) => ComposedInterface,
) {
  return function (options: MountableOptions & ComposedOptions): MountableInterface & ComposedInterface {
    const composed: ComposedInterface = createRoute?.(options) ?? ({} as ComposedInterface)
    const mounted = false

    async function mount(this: MountableInterface & ComposedInterface): Promise<void> {
      this.mounted = true
    }

    async function unmount(this: MountableInterface & ComposedInterface): Promise<void> {
      this.mounted = false
    }

    return { ...composed, mounted, mount, unmount }
  }
}

export { Mountable, MountableOptions, MountableInterface }
