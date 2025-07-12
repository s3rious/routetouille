import classNames from "classnames/dedupe";
import * as React from "react";
import type { ReactElement, ReactNode } from "react";

import { Spacing, type SpacingSize } from "components/atoms/Spacing";

import styles from "./Stack.module.css";

type StackAligns = "stretch" | "start" | "center" | "end" | "baseline";

type GeneralStackProps = {
  children?: ReactNode | ReactNode[];
  className?: string;
  align?: StackAligns;
  inline?: boolean;
};

type VerticalStackProps = {
  vertical: SpacingSize;
} & GeneralStackProps;

type HorizontalStackProps = {
  horizontal: SpacingSize;
} & GeneralStackProps;

type StackProps = XOR<VerticalStackProps, HorizontalStackProps>;

function Stack({
  children,
  className,
  vertical,
  horizontal,
  align = "stretch",
  inline = false,
}: StackProps): ReactElement {
  const classes = classNames(className, styles.Stack, {
    [styles.Stack_vertical]: vertical,
    [styles.Stack_horizontal]: horizontal,
    [styles[`Stack_align_${align}`]]: align,
    [styles.Stack_inline]: inline,
  });

  return (
    <div className={classes}>
      {React.Children.map(children, (child, index) => {
        if (!child) return null;
        const isFirst = index === 0;
        const key =
          React.isValidElement(child) && child.key != null ? child.key : index;
        if (isFirst) {
          return child;
        }
        if (vertical) {
          return React.createElement(Spacing, { top: vertical, key }, child);
        }
        return React.createElement(Spacing, { left: horizontal, key }, child);
      })}
    </div>
  );
}

export { Stack };
