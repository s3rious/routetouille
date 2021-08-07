import * as React from 'react'
import { ReactElement } from 'react'
import classNames from 'classnames/dedupe'

import { Spinner } from 'components/atoms/Spinner'

import styles from './Preloader.module.css'

type PreloaderProps = {
  className?: string
  shown?: boolean
}

function Preloader({ className, shown }: PreloaderProps): ReactElement | null {
  if (shown) {
    return (
      <div className={classNames(className, styles.Preloader)}>
        <Spinner />
      </div>
    )
  }

  return null
}

export { Preloader }
