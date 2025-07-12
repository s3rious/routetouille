import type {
  WithGoToOptions,
  WithGoToInterface,
  GoToOptions as OriginalGoToOptions,
} from "../WithGoTo/index.js";
import type {
  WithSetInterface,
  WithSetOptions,
  SetActivator,
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
  Activator,
} from "../WithActive/index.js";
import type { WithMapInterface, WithMapOptions } from "../WithMap/index.js";

import type { HistoryInterface } from "../../History/index.js";

type RouterComposedOptions = WithGoToOptions &
  WithSetOptions &
  WithParamsOptions &
  WithPathnameOptions &
  WithActiveOptions &
  WithMapOptions;
type RouterComposedInterface = WithGoToInterface &
  WithSetInterface &
  WithParamsInterface &
  WithPathnameInterface &
  WithActiveInterface &
  WithMapInterface;

type GoToState = {
  scrollTop: number;
};
type GoToMethod = "push" | "replace" | null;
type GoToOptions = {
  method?: GoToMethod;
  state?: GoToState;
} & OriginalGoToOptions;

type WithHistoryOptions = {
  history?: HistoryInterface;
};
type WithHistoryInterface = WithHistoryOptions & {
  goTo: (
    activator: SetActivator | ActiveActivator,
    options?: GoToOptions,
  ) => Promise<void>;
  init: () => Promise<void>;
};

function isGoToState(unknown: unknown): unknown is GoToState {
  if (typeof unknown === "object" && unknown !== null) {
    if (Object.hasOwn(unknown, "scrollTop")) {
      return true;
    }
  }

  return false;
}

function WithHistory<
  ComposedOptions extends RouterComposedOptions,
  ComposedInterface extends RouterComposedInterface,
>(createRouter?: (options: ComposedOptions) => ComposedInterface) {
  return (options: WithHistoryOptions & ComposedOptions) => {
    const composed: ComposedInterface =
      createRouter?.(options) ?? ({} as ComposedInterface);
    const { history } = options;
    let currentCount: number = 0;

    async function activate(
      this: WithHistoryInterface & ComposedInterface,
      activator: Activator,
      params: Params = [],
      optimistic?: boolean,
    ): Promise<void> {
      await composed.activate.bind(this)(activator, params, optimistic);

      if (currentCount + 1 > currentCount) {
        if (currentCount > 0) {
          if (this.history != null) {
            this.history.replace(this.pathname, { scrollTop: 0 });
          }
        }

        currentCount = currentCount + 1;
      }
    }

    function goTo(
      activator: SetActivator,
      options?: GoToOptions,
    ): Promise<void>;
    function goTo(
      activator: ActiveActivator,
      options?: GoToOptions,
    ): Promise<void>;
    async function goTo(
      this: WithHistoryInterface & ComposedInterface,
      activator: SetActivator | ActiveActivator,
      options: GoToOptions = { method: "push", state: { scrollTop: 0 } },
    ): Promise<void> {
      currentCount = 0;
      const { method = "push", ...restOptions } = options;
      await composed.goTo.bind(this)(activator, restOptions);

      if (this.history != null && typeof method === "string") {
        this.history[method](this.pathname, options.state ?? { scrollTop: 0 });
      }
    }

    async function init(
      this: WithHistoryInterface & ComposedInterface,
    ): Promise<void> {
      if (this.history?.pathname != null) {
        this.history.emitter.on("popstate", (pathname, popState): void => {
          const state = { scrollTop: 0 };

          if (isGoToState(popState)) {
            state.scrollTop = popState.scrollTop;
          }

          void this.goTo.bind(this)(pathname, {
            optimistic: true,
            method: null,
            state,
          });
        });

        await this.goTo.bind(this)(this.history.pathname, {
          method: "replace",
          state: { scrollTop: 0 },
        });
      }
    }

    return { ...composed, history, activate, goTo, init };
  };
}

export {
  WithHistory,
  type WithHistoryOptions,
  type WithHistoryInterface,
  isGoToState,
};
