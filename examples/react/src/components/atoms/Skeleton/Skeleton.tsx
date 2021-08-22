import * as React from 'react'
import { ReactElement, ReactNode } from 'react'

import styles from './Skeleton.module.css'

type SkeletonProps = {
  children: ReactNode
  mix?: boolean
}

function Skeleton({ children, mix }: SkeletonProps): ReactElement {
  if (mix && React.isValidElement(children)) {
    return React.cloneElement(children, { className: styles.Skeleton })
  }

  return <div className={styles.Skeleton}>{children}</div>
}

export { Skeleton, SkeletonProps }
