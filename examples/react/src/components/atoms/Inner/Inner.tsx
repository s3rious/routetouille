import * as React from 'react'
import { ReactElement, ReactNode } from 'react'
import classNames from 'classnames/dedupe'

import { Spacing } from 'components/atoms/Spacing'

import styles from './Inner.module.css'

type InnerProps = {
  children: ReactNode
  className?: string
  fullHeight?: boolean
}

function Inner({ children, className, fullHeight }: InnerProps): ReactElement {
  return (
    <Spacing className={classNames(className, styles.Inner, { [styles.Inner_fullHeight]: fullHeight })} horizontal={32}>
      {children}
    </Spacing>
  )
}

export { Inner, InnerProps }
