import {
  WithRoot,
  type WithRootOptions,
  type WithRootInterface,
} from "./WithRoot/index.js";
import {
  WithMap,
  type WithMapOptions,
  type WithMapInterface,
} from "./WithMap/index.js";
import {
  WithActive,
  type WithActiveOptions,
  type WithActiveInterface,
} from "./WithActive/index.js";
import {
  WithPathname,
  type WithPathnameOptions,
  type WithPathnameInterface,
} from "./WithPathname/index.js";
import {
  WithParams,
  type WithParamsOptions,
  type WithParamsInterface,
} from "./WithParams/index.js";
import {
  WithSet,
  type WithSetOptions,
  type WithSetInterface,
} from "./WithSet/index.js";
import {
  WithUrlTo,
  type WithUrlToOptions,
  type WithUrlToInterface,
} from "./WithUrlTo/index.js";
import {
  WithGoTo,
  type WithGoToOptions,
  type WithGoToInterface,
} from "./WithGoTo/index.js";
import {
  WithHistory,
  type WithHistoryOptions,
  type WithHistoryInterface,
} from "./WithHistory/index.js";
import {
  Subscribable,
  type SubscribableOptions,
  type SubscribableInterface,
} from "./Subscribable/index.js";

type RouterOptions = WithRootOptions &
  WithMapOptions &
  WithActiveOptions &
  WithPathnameOptions &
  WithParamsOptions &
  WithSetOptions &
  WithUrlToOptions &
  WithGoToOptions &
  WithHistoryOptions &
  SubscribableOptions;
type RouterInterface = WithRootInterface &
  WithMapInterface &
  WithActiveInterface &
  WithPathnameInterface &
  WithParamsInterface &
  WithSetInterface &
  WithUrlToInterface &
  WithGoToInterface &
  WithHistoryInterface &
  SubscribableInterface;

type CreateRouter = (options: RouterOptions) => RouterInterface;

const Router: CreateRouter = Subscribable(
  WithHistory(
    WithGoTo(
      WithUrlTo(
        WithSet(WithParams(WithPathname(WithActive(WithMap(WithRoot()))))),
      ),
    ),
  ),
);

export { Router, type RouterOptions, type RouterInterface };
