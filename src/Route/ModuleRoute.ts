import { WithName, WithNameOptions, WithNameInterface } from './WithName'

import { Mountable, MountableOptions, MountableInterface } from './Mountable'
import { WithBeforeMount, WithBeforeMountOptions, WithBeforeMountInterface } from './WithBeforeMount'
import { WithBeforeUnmount, WithBeforeUnmountInterface, WithBeforeUnmountOptions } from './WithBeforeUnmount'
import { WithAfterMount, WithAfterMountOptions, WithAfterMountInterface } from './WithAfterMount'
import { WithAfterUnmount, WithAfterUnmountOptions, WithAfterUnmountInterface } from './WithAfterUnmount'
import { Redirectable, RedirectableOptions, RedirectableInterface } from './Redirectable'

import { WithChildren, WithChildrenOptions, WithChildrenInterface } from './WithChildren'

type ModuleRouteOptions = WithNameOptions &
  MountableOptions &
  WithBeforeMountOptions &
  WithBeforeUnmountOptions &
  WithAfterMountOptions &
  WithAfterUnmountOptions &
  RedirectableOptions &
  WithChildrenOptions
type ModuleRouteInterface = WithNameInterface &
  MountableInterface &
  WithBeforeMountInterface &
  WithBeforeUnmountInterface &
  WithAfterMountInterface &
  WithAfterUnmountInterface &
  RedirectableInterface &
  WithChildrenInterface

type CreateModuleRoute = (options: ModuleRouteOptions) => ModuleRouteInterface

const ModuleRoute: CreateModuleRoute = WithChildren(
  WithAfterUnmount(WithAfterMount(WithBeforeUnmount(WithBeforeMount(Redirectable(Mountable(WithName())))))),
)

export { ModuleRoute, ModuleRouteOptions, ModuleRouteInterface }
