import * as React from 'react'
import { ReactElement, ReactNode } from 'react'
import classNames from 'classnames/dedupe'

import styles from './AllCenter.module.css'

type AllCenterProps = {
  children: ReactNode
  className?: string
}

function AllCenter({ children, className }: AllCenterProps): ReactElement {
  return <div className={classNames(className, styles.AllCenter)}>{children}</div>
}

export { AllCenter, AllCenterProps }
