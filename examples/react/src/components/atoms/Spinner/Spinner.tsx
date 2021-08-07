import * as React from 'react'
import { ReactElement } from 'react'
import classNames from 'classnames/dedupe'

import styles from './Spinner.module.css'

type SpinnerProps = {
  className?: string
}

function Spinner({ className }: SpinnerProps): ReactElement {
  return <div className={classNames(className, styles.Spinner)} />
}

export { Spinner }
