import classNames from "classnames/dedupe";
import type { ReactElement, ReactNode } from "react";

import styles from "./Width.module.css";

type WidthProps = {
  children: ReactNode;
  className?: string;
  size: number;
  center?: boolean;
};

function Width({
  children,
  className,
  size,
  center = false,
}: WidthProps): ReactElement {
  return (
    <div
      className={classNames(className, styles.Width, {
        [styles.Width_center]: center,
      })}
      style={{ width: size }}
    >
      {children}
    </div>
  );
}

export { Width };
