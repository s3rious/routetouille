import { createNanoEvents, Emitter } from 'nanoevents'
import { Activator, WithActiveInterface, WithActiveOptions } from '../WithActive'
import { AbstractRoute } from '../WithMap'

type Events = {
  beforeActivate: (routes: AbstractRoute[]) => void
  afterActivate: (routes: AbstractRoute[]) => void
}

type SubscribableOptions = {}

type SubscribableInterface = Emitter<Events> & {
  activate: (activator: Activator, optimistic?: boolean) => Promise<void>
}

function Subscribable<ComposedOptions extends WithActiveOptions, ComposedInterface extends WithActiveInterface>(
  createRouter?: (options: ComposedOptions) => ComposedInterface,
) {
  return function (options: SubscribableOptions & ComposedOptions): SubscribableInterface & ComposedInterface {
    const emitter: Emitter<Events> = createNanoEvents()
    const composed: ComposedInterface = createRouter?.(options) ?? ({} as ComposedInterface)

    async function activate(
      this: SubscribableInterface & ComposedInterface,
      activator: Activator,
      optimistic?: boolean,
    ): Promise<void> {
      emitter.emit('beforeActivate', this.active)

      await composed.activate.bind(this)(activator, optimistic)

      emitter.emit('afterActivate', this.active)
    }

    return Object.assign(emitter, composed, { activate })
  }
}

export { Subscribable, SubscribableOptions, SubscribableInterface }
