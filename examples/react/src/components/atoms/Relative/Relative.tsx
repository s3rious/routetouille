import * as React from 'react'
import { ReactElement, ReactNode } from 'react'

import styles from './Relative.module.css'

type RelativeProps = {
  children: ReactNode
  mix?: boolean
}

function Relative({ children, mix = false }: RelativeProps): ReactElement {
  if (mix && React.isValidElement(children)) {
    return React.cloneElement(children, { className: styles.Relative })
  }

  return <div className={styles.Relative}>{children}</div>
}

export { Relative, RelativeProps }
