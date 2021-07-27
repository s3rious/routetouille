import * as React from 'react'
import { ReactElement, ReactNode } from 'react'
import classNames from 'classnames/dedupe'

import styles from './Spacing.module.scss'

type SpacingSize = null | 4 | 8 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 56 | 64 | 80 | 120

type SpacingProps = {
  children?: ReactNode
  className?: string
  top?: SpacingSize
  bottom?: SpacingSize
  vertical?: SpacingSize
  left?: SpacingSize
  right?: SpacingSize
  horizontal?: SpacingSize
  all?: SpacingSize
  mix?: boolean
}

function Spacing({
  children,
  className,
  top,
  bottom,
  vertical,
  left,
  right,
  horizontal,
  all,
  mix = false,
}: SpacingProps): ReactElement {
  if (vertical && typeof top === 'undefined') {
    top = vertical
  }

  if (vertical && typeof bottom === 'undefined') {
    bottom = vertical
  }

  if (horizontal && typeof left === 'undefined') {
    left = horizontal
  }

  if (horizontal && typeof right === 'undefined') {
    right = horizontal
  }

  if (all && typeof top === 'undefined') {
    top = all
  }

  if (all && typeof bottom === 'undefined') {
    bottom = all
  }

  if (all && typeof left === 'undefined') {
    left = all
  }

  if (all && typeof right === 'undefined') {
    right = all
  }

  /* eslint-disable @typescript-eslint/restrict-template-expressions */
  const classes = classNames(className, styles.Spacing, {
    [styles[`Spacing_top_${top}`]]: top,
    [styles[`Spacing_right_${right}`]]: right,
    [styles[`Spacing_bottom_${bottom}`]]: bottom,
    [styles[`Spacing_left_${left}`]]: left,
  })
  /* eslint-enable @typescript-eslint/restrict-template-expressions */

  if (mix && React.isValidElement(children)) {
    return React.cloneElement(children, { className: classes })
  }

  return <div className={classes}>{children}</div>
}

export { Spacing, SpacingProps, SpacingSize }
