import * as React from 'react'
import { ReactElement, useContext } from 'react'
import classNames from 'classnames/dedupe'

import { RelativeContext } from 'components/atoms/Relative'
import { Spinner } from 'components/atoms/Spinner'

import styles from './Preloader.module.css'

type PreloaderProps = {
  className?: string
  shown?: boolean
}

function Preloader({ className, shown }: PreloaderProps): ReactElement | null {
  const insideRelative = useContext(RelativeContext)
  const classes = classNames(className, styles.Preloader, { [styles.Preloader_insideRelative]: insideRelative })

  if (shown) {
    return (
      <div className={classes}>
        <Spinner />
      </div>
    )
  }

  return null
}

export { Preloader }
