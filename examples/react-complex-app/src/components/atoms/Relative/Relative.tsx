import * as React from "react";
import {
  type Context as ReactContext,
  type ReactElement,
  type ReactNode,
  createContext,
} from "react";

import styles from "./Relative.module.css";

type RelativeProps = {
  children: ReactNode;
  mix?: boolean;
};

const RelativeContext: ReactContext<boolean> = createContext<boolean>(false);
RelativeContext.displayName = "RelativeContext";

function Relative({ children, mix = false }: RelativeProps): ReactElement {
  if (mix && React.isValidElement(children)) {
    return (
      <RelativeContext.Provider value={true}>
        {React.isValidElement(children)
          ? React.cloneElement(children as React.ReactElement<unknown>, {
              className: styles.Relative,
            })
          : children}
      </RelativeContext.Provider>
    );
  }

  return (
    <RelativeContext.Provider value={true}>
      <div className={styles.Relative}>{children}</div>
    </RelativeContext.Provider>
  );
}

export { Relative, RelativeContext, type RelativeProps };
