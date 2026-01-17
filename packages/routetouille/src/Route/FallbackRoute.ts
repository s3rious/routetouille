import {
  WithName,
  type WithNameOptions,
  type WithNameInterface,
} from "./WithName/index.js";
import {
  Fallback,
  type FallbackOptions,
  type FallbackInterface,
} from "./Fallback/index.js";
import {
  Mountable,
  type MountableOptions,
  type MountableInterface,
} from "./Mountable/index.js";
import {
  WithBeforeMount,
  type WithBeforeMountOptions,
  type WithBeforeMountInterface,
} from "./WithBeforeMount/index.js";
import {
  WithBeforeUnmount,
  type WithBeforeUnmountOptions,
  type WithBeforeUnmountInterface,
} from "./WithBeforeUnmount/index.js";
import {
  WithAfterMount,
  type WithAfterMountOptions,
  type WithAfterMountInterface,
} from "./WithAfterMount/index.js";
import {
  WithAfterUnmount,
  type WithAfterUnmountOptions,
  type WithAfterUnmountInterface,
} from "./WithAfterUnmount/index.js";
import {
  Redirectable,
  type RedirectableOptions,
  type RedirectableInterface,
} from "./Redirectable/index.js";

type FallbackRouteOptions = WithNameOptions &
  FallbackOptions &
  MountableOptions &
  WithBeforeMountOptions &
  WithBeforeUnmountOptions &
  WithAfterMountOptions &
  WithAfterUnmountOptions &
  RedirectableOptions;
type FallbackRouteInterface = WithNameInterface &
  FallbackInterface &
  MountableInterface &
  WithBeforeMountInterface &
  WithBeforeUnmountInterface &
  WithAfterMountInterface &
  WithAfterUnmountInterface &
  RedirectableInterface;

type CreateFallbackRoute = (
  options: FallbackRouteOptions,
) => FallbackRouteInterface;

const FallbackRoute: CreateFallbackRoute = WithAfterUnmount(
  WithAfterMount(
    WithBeforeUnmount(
      WithBeforeMount(Redirectable(Mountable(Fallback(WithName())))),
    ),
  ),
);

export {
  FallbackRoute,
  type FallbackRouteOptions,
  type FallbackRouteInterface,
};
