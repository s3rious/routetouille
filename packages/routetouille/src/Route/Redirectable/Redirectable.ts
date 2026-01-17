import type {
  MountableInterface,
  MountableOptions,
} from "../Mountable/index.js";

type ShouldWe = () => Promise<boolean>;
type WhatTo = () => Promise<void>;
type Redirect = [shouldWe: ShouldWe, whatTo: WhatTo];

type RedirectableOptions = {
  redirects?: Redirect[];
};

type RedirectableInterface = Record<string, unknown>;

function Redirectable<
  ComposedOptions extends MountableOptions,
  ComposedInterface extends MountableInterface,
>(createRoute?: (options: ComposedOptions) => ComposedInterface) {
  return (
    options: RedirectableOptions & ComposedOptions,
  ): RedirectableInterface & ComposedInterface => {
    const composed: ComposedInterface =
      createRoute?.(options) ?? ({} as ComposedInterface);
    const redirects = options.redirects ?? [];

    async function mount(
      this: RedirectableInterface & ComposedInterface,
    ): Promise<void> {
      if (redirects.length > 0) {
        for (const redirect of redirects) {
          const [shouldWe, whatTo] = redirect;

          if (await shouldWe()) {
            return await whatTo();
          }
        }
      }

      return await composed.mount.bind(this)();
    }

    return { ...composed, mount };
  };
}

export {
  Redirectable,
  type RedirectableOptions,
  type RedirectableInterface,
  type ShouldWe,
  type WhatTo,
  type Redirect,
};
