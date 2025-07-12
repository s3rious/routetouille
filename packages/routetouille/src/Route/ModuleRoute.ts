import {
  WithName,
  type WithNameOptions,
  type WithNameInterface,
} from "./WithName/index.js";
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
  type WithBeforeUnmountInterface,
  type WithBeforeUnmountOptions,
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
import {
  WithChildren,
  type WithChildrenOptions,
  type WithChildrenInterface,
} from "./WithChildren/index.js";

type ModuleRouteOptions = WithNameOptions &
  MountableOptions &
  WithBeforeMountOptions &
  WithBeforeUnmountOptions &
  WithAfterMountOptions &
  WithAfterUnmountOptions &
  RedirectableOptions &
  WithChildrenOptions;
type ModuleRouteInterface = WithNameInterface &
  MountableInterface &
  WithBeforeMountInterface &
  WithBeforeUnmountInterface &
  WithAfterMountInterface &
  WithAfterUnmountInterface &
  RedirectableInterface &
  WithChildrenInterface;

type CreateModuleRoute = (options: ModuleRouteOptions) => ModuleRouteInterface;

const ModuleRoute: CreateModuleRoute = WithChildren(
  WithAfterUnmount(
    WithAfterMount(
      WithBeforeUnmount(WithBeforeMount(Redirectable(Mountable(WithName())))),
    ),
  ),
);

export { ModuleRoute, type ModuleRouteOptions, type ModuleRouteInterface };
