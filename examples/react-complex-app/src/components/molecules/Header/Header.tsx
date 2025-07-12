import type { ReactElement, ReactNode } from "react";

import { Inner } from "components/atoms/Inner";
import { Logo } from "components/atoms/Logo";
import { Spacing } from "components/atoms/Spacing";

import styles from "./Header.module.css";

type HeaderProps = {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
};

const defaultLeft = <Logo />;

function Header({
  left = defaultLeft,
  center,
  right,
}: HeaderProps): ReactElement {
  return (
    <div className={styles.Header}>
      <Inner className={styles.HeaderInner}>
        {left ? (
          <Spacing className={styles.HeaderLeft} right={16}>
            {left}
          </Spacing>
        ) : (
          <Spacing className={styles.HeaderLeft} right={16} />
        )}
        {center ? (
          <Spacing className={styles.HeaderCenter} horizontal={16}>
            {center}
          </Spacing>
        ) : (
          <Spacing className={styles.HeaderCenter} horizontal={16} />
        )}
        {right ? (
          <Spacing className={styles.HeaderRight} left={16}>
            {right}
          </Spacing>
        ) : (
          <Spacing className={styles.HeaderRight} left={16} />
        )}
      </Inner>
    </div>
  );
}

export { Header, type HeaderProps };
