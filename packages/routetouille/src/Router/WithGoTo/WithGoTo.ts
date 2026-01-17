import {
  type WithSetInterface,
  type WithSetOptions,
  type SetActivator,
  isActivator as isSetActivator,
} from "../WithSet/index.js";
import type {
  Params,
  WithParamsInterface,
  WithParamsOptions,
} from "../WithParams/index.js";
import type {
  WithPathnameInterface,
  WithPathnameOptions,
} from "../WithPathname/index.js";
import type {
  WithActiveInterface,
  WithActiveOptions,
  Activator as ActiveActivator,
} from "../WithActive/index.js";
import type { WithMapInterface, WithMapOptions } from "../WithMap/index.js";

type RouterComposedOptions = WithSetOptions &
  WithParamsOptions &
  WithPathnameOptions &
  WithActiveOptions &
  WithMapOptions;
type RouterComposedInterface = WithSetInterface &
  WithParamsInterface &
  WithPathnameInterface &
  WithActiveInterface &
  WithMapInterface;

type GoToOptions = {
  params?: Params;
  optimistic?: boolean;
};

type WithGoToOptions = Record<string, unknown>;
type WithGoToInterface = WithGoToOptions & {
  goTo: (
    activator: SetActivator | ActiveActivator,
    options?: GoToOptions,
  ) => Promise<void>;
};

function WithGoTo<
  ComposedOptions extends RouterComposedOptions,
  ComposedInterface extends RouterComposedInterface,
>(createRouter?: (options: ComposedOptions) => ComposedInterface) {
  return (options: WithGoToOptions & ComposedOptions) => {
    const composed: ComposedInterface =
      createRouter?.(options) ?? ({} as ComposedInterface);

    function goTo(
      activator: SetActivator,
      options?: GoToOptions,
    ): Promise<void>;
    function goTo(
      activator: ActiveActivator,
      options?: GoToOptions,
    ): Promise<void>;
    async function goTo(
      this: WithGoToInterface & ComposedInterface,
      activator: SetActivator | ActiveActivator,
      options?: GoToOptions,
    ): Promise<void> {
      if (isSetActivator(activator)) {
        await this.set(activator, options?.optimistic);
        return;
      }

      await this.activate(
        activator,
        options?.params ?? [],
        options?.optimistic,
      );
    }

    return { ...composed, goTo };
  };
}

export {
  WithGoTo,
  type WithGoToOptions,
  type WithGoToInterface,
  type GoToOptions,
};
