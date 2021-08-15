import * as React from 'react'
import { ReactElement, ReactNode } from 'react'

import styles from './Background.module.css'

type BackgroundProps = {
  children?: ReactNode
}

function Background({ children }: BackgroundProps): ReactElement {
  return <div className={styles.Background}>{children}</div>
}

export { Background, BackgroundProps }
