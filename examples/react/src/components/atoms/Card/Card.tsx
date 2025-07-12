import classNames from "classnames/dedupe";
import type { ReactElement, ReactNode } from "react";

import styles from "./Card.module.css";

type CardProps = {
  children: ReactNode;
  className?: string;
  level?: 0 | 1 | 2 | 3 | 4;
};

function Card({ children, className, level = 1 }: CardProps): ReactElement {
  return (
    <div
      className={classNames(
        className,
        styles.Card,
        styles[`Card_level_${level}`],
      )}
    >
      {children}
    </div>
  );
}

export { Card, type CardProps };
