import * as React from 'react'
import { Fragment, ReactElement, ReactNode } from 'react'

import styles from './Skeleton.module.css'
import classNames from 'classnames/dedupe'

type SkeletonProps = {
  children: ReactNode
  shown?: boolean
  background?: boolean
  mix?: boolean
}

function Skeleton({ children, shown = true, background = true, mix = false }: SkeletonProps): ReactElement {
  if (!shown) {
    return <Fragment>{children}</Fragment>
  }

  const classes = classNames(styles.Skeleton, {
    [styles.Skeleton_background]: background,
  })

  if (mix && React.isValidElement(children)) {
    return React.cloneElement(children, { className: classes })
  }

  return <div className={classes}>{children}</div>
}

export { Skeleton, SkeletonProps }
