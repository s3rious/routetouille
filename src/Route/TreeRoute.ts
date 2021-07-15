import { WithName, WithNameOptions, WithNameInterface } from './WithName'

import { WithChildren, WithChildrenOptions, WithChildrenInterface } from './WithChildren'
import { WithParent, WithParentOptions, WithParentInterface } from './WithParent'
import { WithRoute, WithRouteOptions, WithRouteInterface } from './WithRoute'
import { WithFallback, WithFallbackOptions, WithFallbackInterface } from './WithFallback'

type TreeRouteOptions = WithNameOptions &
  WithChildrenOptions &
  WithParentOptions &
  WithRouteOptions &
  WithFallbackOptions
type TreeRouteInterface = WithNameInterface &
  WithChildrenInterface &
  WithParentInterface &
  WithRouteInterface &
  WithFallbackInterface

type CreateTreeRoute = (options: TreeRouteOptions) => TreeRouteInterface

const TreeRoute: CreateTreeRoute = WithFallback(WithRoute(WithParent(WithChildren(WithName()))))

export { TreeRoute, TreeRouteOptions, TreeRouteInterface }
