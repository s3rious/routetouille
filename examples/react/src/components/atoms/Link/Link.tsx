import classNames from "classnames/dedupe";
import type { HTMLProps, ReactElement, ReactNode } from "react";

import { type Activator, type Params, useLink } from "services/router";

import styles from "./Link.module.css";

type LinkProps = {
  children: ReactNode;
  className?: string;
  to?: Activator;
  params?: Params;
  optimistic?: boolean;
  saveScrollPosition?: boolean;
} & HTMLProps<HTMLAnchorElement>;

function Link({
  children,
  className,
  to,
  params,
  optimistic = true,
  saveScrollPosition = true,
  href: hrefProp,
  ...rest
}: LinkProps): ReactElement {
  const { href, handleClick } = useLink({
    to,
    params,
    optimistic,
    href: hrefProp,
    saveScrollPosition,
  });

  return (
    <a
      className={classNames(className, styles.Link)}
      href={href}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </a>
  );
}

export { Link, type LinkProps };
