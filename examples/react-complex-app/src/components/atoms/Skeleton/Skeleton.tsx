import * as React from "react";
import type { ReactElement, ReactNode } from "react";

import classNames from "classnames/dedupe";
import styles from "./Skeleton.module.css";

type SkeletonProps = {
  children: ReactNode;
  shown?: boolean;
  background?: boolean;
  mix?: boolean;
};

function Skeleton({
  children,
  shown = true,
  background = true,
  mix = false,
}: SkeletonProps): ReactElement {
  if (!shown) {
    return <>{children}</>;
  }

  const classes = classNames(styles.Skeleton, {
    [styles.Skeleton_background]: background,
  });

  if (mix && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<unknown>, {
      className: classes,
    });
  }

  return <div className={classes}>{children}</div>;
}

export { Skeleton, type SkeletonProps };
