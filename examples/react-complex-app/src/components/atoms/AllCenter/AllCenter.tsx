import classNames from "classnames/dedupe";
import type { ReactElement, ReactNode } from "react";

import styles from "./AllCenter.module.css";

type AllCenterProps = {
  children: ReactNode;
  className?: string;
};

function AllCenter({ children, className }: AllCenterProps): ReactElement {
  return (
    <div className={classNames(className, styles.AllCenter)}>{children}</div>
  );
}

export { AllCenter, type AllCenterProps };
