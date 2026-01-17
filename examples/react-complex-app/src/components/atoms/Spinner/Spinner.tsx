import classNames from "classnames/dedupe";
import type { ReactElement } from "react";

import styles from "./Spinner.module.css";

type SpinnerProps = {
  className?: string;
};

function Spinner({ className }: SpinnerProps): ReactElement {
  return <div className={classNames(className, styles.Spinner)} />;
}

export { Spinner };
