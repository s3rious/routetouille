import { WithRoot, WithRootOptions, WithRootInterface } from './WithRoot'
import { WithMap, WithMapOptions, WithMapInterface } from './WithMap'
import { WithActive, WithActiveOptions, WithActiveInterface } from './WithActive'
import { WithPathname, WithPathnameOptions, WithPathnameInterface } from './WithPathname'
import { WithParams, WithParamsOptions, WithParamsInterface } from './WithParams'
import { WithSet, WithSetOptions, WithSetInterface } from './WithSet'
import { WithUrlTo, WithUrlToOptions, WithUrlToInterface } from './WithUrlTo'
import { WithGoTo, WithGoToOptions, WithGoToInterface } from './WithGoTo'
import { WithHistory, WithHistoryOptions, WithHistoryInterface } from './WithHistory'
import { Subscribable, SubscribableOptions, SubscribableInterface } from './Subscribable'

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
