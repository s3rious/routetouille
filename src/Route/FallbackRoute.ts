import { WithName, WithNameOptions, WithNameInterface } from './WithName'
import { Fallback, FallbackOptions, FallbackInterface } from './Fallback'
import { Mountable, MountableOptions, MountableInterface } from './Mountable'
import { WithBeforeMount, WithBeforeMountOptions, WithBeforeMountInterface } from './WithBeforeMount'
import { WithBeforeUnmount, WithBeforeUnmountOptions, WithBeforeUnmountInterface } from './WithBeforeUnmount'
import { WithAfterMount, WithAfterMountOptions, WithAfterMountInterface } from './WithAfterMount'
import { WithAfterUnmount, WithAfterUnmountOptions, WithAfterUnmountInterface } from './WithAfterUnmount'
import { Redirectable, RedirectableOptions, RedirectableInterface } from './Redirectable'

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
