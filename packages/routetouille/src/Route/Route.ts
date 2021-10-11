import { WithName, WithNameOptions, WithNameInterface } from './WithName'
import { WithPath, WithPathOptions, WithPathInterface } from './WithPath'

import { Mountable, MountableOptions, MountableInterface } from './Mountable'
import { WithBeforeMount, WithBeforeMountOptions, WithBeforeMountInterface } from './WithBeforeMount'
import { WithBeforeUnmount, WithBeforeUnmountOptions, WithBeforeUnmountInterface } from './WithBeforeUnmount'
import { WithAfterMount, WithAfterMountOptions, WithAfterMountInterface } from './WithAfterMount'
import { WithAfterUnmount, WithAfterUnmountOptions, WithAfterUnmountInterface } from './WithAfterUnmount'
import { Redirectable, RedirectableOptions, RedirectableInterface } from './Redirectable'

import { WithChildren, WithChildrenOptions, WithChildrenInterface } from './WithChildren'

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
