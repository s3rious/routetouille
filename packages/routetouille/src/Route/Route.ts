import {
  WithName,
  type WithNameOptions,
  type WithNameInterface,
} from "./WithName/index.js";
import {
  WithPath,
  type WithPathOptions,
  type WithPathInterface,
} from "./WithPath/index.js";

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

import {
  WithChildren,
  type WithChildrenOptions,
  type WithChildrenInterface,
} from "./WithChildren/index.js";

type RouteOptions = WithNameOptions &
  WithPathOptions &
  MountableOptions &
  WithBeforeMountOptions &
  WithBeforeUnmountOptions &
  WithAfterMountOptions &
  WithAfterUnmountOptions &
  RedirectableOptions &
  WithChildrenOptions;
type RouteInterface = WithNameInterface &
  WithPathInterface &
  MountableInterface &
  WithBeforeMountInterface &
  WithBeforeUnmountInterface &
  WithAfterMountInterface &
  WithAfterUnmountInterface &
  RedirectableInterface &
  WithChildrenInterface;

type CreateRoute = (options: RouteOptions) => RouteInterface;

const Route: CreateRoute = WithChildren(
  WithAfterUnmount(
    WithAfterMount(
      WithBeforeUnmount(
        WithBeforeMount(Redirectable(Mountable(WithPath(WithName())))),
      ),
    ),
  ),
);

export { Route, type RouteOptions, type RouteInterface };
