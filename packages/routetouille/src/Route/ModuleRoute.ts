import { WithName, WithNameOptions, WithNameInterface } from './WithName/index.js'
import { Mountable, MountableOptions, MountableInterface } from './Mountable/index.js'
import { WithBeforeMount, WithBeforeMountOptions, WithBeforeMountInterface } from './WithBeforeMount/index.js'
import { WithBeforeUnmount, WithBeforeUnmountInterface, WithBeforeUnmountOptions } from './WithBeforeUnmount/index.js'
import { WithAfterMount, WithAfterMountOptions, WithAfterMountInterface } from './WithAfterMount/index.js'
import { WithAfterUnmount, WithAfterUnmountOptions, WithAfterUnmountInterface } from './WithAfterUnmount/index.js'
import { Redirectable, RedirectableOptions, RedirectableInterface } from './Redirectable/index.js'
import { WithChildren, WithChildrenOptions, WithChildrenInterface } from './WithChildren/index.js'

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
