import { WithRoot, WithRootOptions, WithRootInterface } from './WithRoot/index.js'
import { WithMap, WithMapOptions, WithMapInterface } from './WithMap/index.js'
import { WithActive, WithActiveOptions, WithActiveInterface } from './WithActive/index.js'
import { WithPathname, WithPathnameOptions, WithPathnameInterface } from './WithPathname/index.js'
import { WithParams, WithParamsOptions, WithParamsInterface } from './WithParams/index.js'
import { WithSet, WithSetOptions, WithSetInterface } from './WithSet/index.js'
import { WithUrlTo, WithUrlToOptions, WithUrlToInterface } from './WithUrlTo/index.js'
import { WithGoTo, WithGoToOptions, WithGoToInterface } from './WithGoTo/index.js'
import { WithHistory, WithHistoryOptions, WithHistoryInterface } from './WithHistory/index.js'
import { Subscribable, SubscribableOptions, SubscribableInterface } from './Subscribable/index.js'

type RouterOptions = WithRootOptions &
  WithMapOptions &
  WithActiveOptions &
  WithPathnameOptions &
  WithParamsOptions &
  WithSetOptions &
  WithUrlToOptions &
  WithGoToOptions &
  WithHistoryOptions &
  SubscribableOptions
type RouterInterface = WithRootInterface &
  WithMapInterface &
  WithActiveInterface &
  WithPathnameInterface &
  WithParamsInterface &
  WithSetInterface &
  WithUrlToInterface &
  WithGoToInterface &
  WithHistoryInterface &
  SubscribableInterface

type CreateRouter = (options: RouterOptions) => RouterInterface

const Router: CreateRouter = Subscribable(
  WithHistory(WithGoTo(WithUrlTo(WithSet(WithParams(WithPathname(WithActive(WithMap(WithRoot())))))))),
)

export { Router, RouterOptions, RouterInterface }
