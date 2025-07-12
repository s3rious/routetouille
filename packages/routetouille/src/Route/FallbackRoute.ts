import { WithName, WithNameOptions, WithNameInterface } from './WithName/index.js'
import { Fallback, FallbackOptions, FallbackInterface } from './Fallback/index.js'
import { Mountable, MountableOptions, MountableInterface } from './Mountable/index.js'
import { WithBeforeMount, WithBeforeMountOptions, WithBeforeMountInterface } from './WithBeforeMount/index.js'
import { WithBeforeUnmount, WithBeforeUnmountOptions, WithBeforeUnmountInterface } from './WithBeforeUnmount/index.js'
import { WithAfterMount, WithAfterMountOptions, WithAfterMountInterface } from './WithAfterMount/index.js'
import { WithAfterUnmount, WithAfterUnmountOptions, WithAfterUnmountInterface } from './WithAfterUnmount/index.js'
import { Redirectable, RedirectableOptions, RedirectableInterface } from './Redirectable/index.js'

type FallbackRouteOptions = WithNameOptions &
  FallbackOptions &
  MountableOptions &
  WithBeforeMountOptions &
  WithBeforeUnmountOptions &
  WithAfterMountOptions &
  WithAfterUnmountOptions &
  RedirectableOptions
type FallbackRouteInterface = WithNameInterface &
  FallbackInterface &
  MountableInterface &
  WithBeforeMountInterface &
  WithBeforeUnmountInterface &
  WithAfterMountInterface &
  WithAfterUnmountInterface &
  RedirectableInterface

type CreateFallbackRoute = (options: FallbackRouteOptions) => FallbackRouteInterface

const FallbackRoute: CreateFallbackRoute = WithAfterUnmount(
  WithAfterMount(WithBeforeUnmount(WithBeforeMount(Redirectable(Mountable(Fallback(WithName())))))),
)

export { FallbackRoute, FallbackRouteOptions, FallbackRouteInterface }
