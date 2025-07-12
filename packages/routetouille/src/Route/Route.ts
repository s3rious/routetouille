import { WithName, WithNameOptions, WithNameInterface } from './WithName/index.js'
import { WithPath, WithPathOptions, WithPathInterface } from './WithPath/index.js'

import { Mountable, MountableOptions, MountableInterface } from './Mountable/index.js'
import { WithBeforeMount, WithBeforeMountOptions, WithBeforeMountInterface } from './WithBeforeMount/index.js'
import { WithBeforeUnmount, WithBeforeUnmountOptions, WithBeforeUnmountInterface } from './WithBeforeUnmount/index.js'
import { WithAfterMount, WithAfterMountOptions, WithAfterMountInterface } from './WithAfterMount/index.js'
import { WithAfterUnmount, WithAfterUnmountOptions, WithAfterUnmountInterface } from './WithAfterUnmount/index.js'
import { Redirectable, RedirectableOptions, RedirectableInterface } from './Redirectable/index.js'

import { WithChildren, WithChildrenOptions, WithChildrenInterface } from './WithChildren/index.js'

type RouteOptions = WithNameOptions &
  WithPathOptions &
  MountableOptions &
  WithBeforeMountOptions &
  WithBeforeUnmountOptions &
  WithAfterMountOptions &
  WithAfterUnmountOptions &
  RedirectableOptions &
  WithChildrenOptions
type RouteInterface = WithNameInterface &
  WithPathInterface &
  MountableInterface &
  WithBeforeMountInterface &
  WithBeforeUnmountInterface &
  WithAfterMountInterface &
  WithAfterUnmountInterface &
  RedirectableInterface &
  WithChildrenInterface

type CreateRoute = (options: RouteOptions) => RouteInterface

const Route: CreateRoute = WithChildren(
  WithAfterUnmount(WithAfterMount(WithBeforeUnmount(WithBeforeMount(Redirectable(Mountable(WithPath(WithName()))))))),
)

export { Route, RouteOptions, RouteInterface }
