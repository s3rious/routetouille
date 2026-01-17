import classNames from "classnames/dedupe";
import type { HTMLProps, ReactElement, ReactNode } from "react";

import styles from "./Button.module.css";

type ButtonTheme = "primary" | "secondary" | "outline";

type ButtonProps = {
  children: ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  theme?: ButtonTheme;
  disabled?: boolean;
  block?: boolean;
} & HTMLProps<HTMLButtonElement>;

function Button({
  children,
  className,
  type = "button",
  theme = "primary",
  disabled = false,
  block = false,
  ...rest
}: ButtonProps): ReactElement {
  const classes = classNames(className, styles.Button, {
    [styles.Button_block]: block,
    [styles.Button_disabled]: disabled,
    [styles[`Button_theme_${theme}`]]: theme,
  });

  return (
    <button className={classes} type={type} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}

export { Button, type ButtonProps, type ButtonTheme };
